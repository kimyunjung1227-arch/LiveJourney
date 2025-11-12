import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { getCoordinatesByLocation, searchRegions } from '../utils/regionLocationMapping';

const MapScreen = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const pinsRef = useRef([]);
  
  const [allPins, setAllPins] = useState([]);
  const [visiblePins, setVisiblePins] = useState([]);
  const [mapLoading, setMapLoading] = useState(true);
  
  // 검색
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  
  // 하단 시트
  const [showSheet, setShowSheet] = useState(true);
  const sheetRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  
  // 초기화
  useEffect(() => {
    const init = () => {
      if (!window.kakao || !window.kakao.maps) {
        setTimeout(init, 100);
        return;
      }

      if (!mapRef.current) {
        setTimeout(init, 100);
        return;
      }

      try {
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 4
        });
        
        mapInstance.current = map;
        setMapLoading(false);
        loadAllData();
      } catch (error) {
        console.error('지도 생성 실패:', error);
        setTimeout(init, 500);
      }
    };

    init();
  }, []);

  // 데이터 로드
  const loadAllData = useCallback(() => {
    const posts = JSON.parse(localStorage.getItem('uploadedPosts') || '[]');

    const pins = posts
      .map((p) => {
        const coords = p.coordinates || getCoordinatesByLocation(p.detailedLocation || p.location);
        if (!coords || !p.images?.[0]) return null;
        
        return {
          id: p.id,
          lat: coords.lat,
          lng: coords.lng,
          image: p.images[0],
          title: p.detailedLocation || p.location,
          categoryName: p.categoryName,
          post: p
        };
      })
      .filter(Boolean);

    setAllPins(pins);
    
    if (pins.length > 0 && mapInstance.current) {
      createPins(pins);
    }
  }, []);

  // 핀 생성
  const createPins = useCallback((pins) => {
    if (!mapInstance.current || pinsRef.current.length > 0) return;

    window.handleMapPinClick = (pinId) => {
      const pin = pins.find(p => p.id === pinId);
      if (pin && mapInstance.current) {
        mapInstance.current.setCenter(new window.kakao.maps.LatLng(pin.lat, pin.lng));
        mapInstance.current.setLevel(3);
        navigate(`/post/${pin.id}`, { state: { post: pin.post } });
      }
    };

    pins.forEach((pin, i) => {
      const pos = new window.kakao.maps.LatLng(pin.lat, pin.lng);
      
      const el = document.createElement('div');
      el.innerHTML = `
        <button 
          class="pin-btn relative w-12 h-12 border-2 border-white shadow-lg rounded-md overflow-hidden hover:scale-110 transition-all duration-200 cursor-pointer" 
          style="z-index: ${i}" 
          onclick="window.handleMapPinClick('${pin.id}')"
        >
          <img class="w-full h-full object-cover" src="${pin.image}" alt="${pin.title}"/>
        </button>
      `;

      const overlay = new window.kakao.maps.CustomOverlay({
        position: pos,
        content: el,
        yAnchor: 1,
        zIndex: i
      });

      overlay.setMap(mapInstance.current);
      pinsRef.current.push({ id: pin.id, overlay, element: el.firstChild });
    });

    updateVisiblePins();
  }, [navigate]);

  // 보이는 핀 업데이트
  const updateVisiblePins = useCallback(() => {
    if (!mapInstance.current || allPins.length === 0) return;

    const bounds = mapInstance.current.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();

    const visible = allPins.filter(p =>
      p.lat >= sw.getLat() && p.lat <= ne.getLat() &&
      p.lng >= sw.getLng() && p.lng <= ne.getLng()
    );

    setVisiblePins(visible);
  }, [allPins]);

  useEffect(() => {
    if (allPins.length > 0 && mapInstance.current) {
      const listener = window.kakao.maps.event.addListener(mapInstance.current, 'idle', updateVisiblePins);
      return () => window.kakao.maps.event.removeListener(mapInstance.current, 'idle', listener);
    }
  }, [allPins, updateVisiblePins]);

  // 검색
  const handleSearchChange = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    setSearchResults(q ? searchRegions(q) : []);
  };

  const selectRegion = useCallback((region) => {
    const coords = getCoordinatesByLocation(region);
    if (coords && mapInstance.current) {
      mapInstance.current.setCenter(new window.kakao.maps.LatLng(coords.lat, coords.lng));
      mapInstance.current.setLevel(4);
    }
    setShowSearch(false);
    setSearchQuery('');
  }, []);

  // 새로고침
  const refresh = () => {
    pinsRef.current.forEach(({ overlay }) => overlay.setMap(null));
    pinsRef.current = [];
    loadAllData();
  };

  // 시트 드래그
  const sheetDragStart = useCallback((e) => {
    setIsDragging(true);
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    setDragStart(clientY);
  }, []);

  const sheetDragMove = useCallback((e) => {
    if (!isDragging || !sheetRef.current) return;
    
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - dragStart;
    
    if (deltaY >= 0) {
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
      sheetRef.current.style.transition = 'none';
    }
  }, [isDragging, dragStart]);

  const sheetDragEnd = useCallback(() => {
    if (!sheetRef.current) return;
    
    const transform = sheetRef.current.style.transform;
    const translateY = transform ? parseInt(transform.match(/translateY\((.+)px\)/)?.[1] || 0) : 0;
    
    if (translateY > 80) {
      sheetRef.current.style.transform = 'translateY(100%)';
      sheetRef.current.style.transition = 'transform 0.3s ease';
      setTimeout(() => setShowSheet(false), 300);
    } else {
      sheetRef.current.style.transform = 'translateY(0)';
      sheetRef.current.style.transition = 'transform 0.3s ease';
    }
    
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    
    const handleMove = (e) => sheetDragMove(e);
    const handleUp = () => sheetDragEnd();
    
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);
    
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, sheetDragMove, sheetDragEnd]);

  return (
    <div 
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#e4e4e7',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      {/* 지도 영역 - 전체 화면 */}
      <div 
        ref={mapRef} 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0
        }}
      />

      {/* 지도 로딩 */}
      {mapLoading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold">지도 로딩 중...</p>
          </div>
        </div>
      )}

      {/* 상단 - 검색바 + 새로고침 */}
      <div style={{
        position: 'absolute',
        top: 'env(safe-area-inset-top, 0px)',
        left: 0,
        right: 0,
        zIndex: 40,
        padding: '16px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setShowSearch(true)} 
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: 'none'
            }}
          >
            <span className="material-symbols-outlined text-zinc-500">search</span>
            <span className="text-zinc-500 text-sm">지역 검색</span>
          </button>
          <button 
            onClick={refresh} 
            style={{
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: 'none'
            }}
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>

      {/* 우측 컨트롤 */}
      <div style={{
        position: 'absolute',
        right: '16px',
        bottom: showSheet ? '280px' : '100px',
        zIndex: 40,
        transition: 'bottom 0.3s'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <button 
              onClick={() => mapInstance.current?.setLevel(mapInstance.current.getLevel() - 1)} 
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                backgroundColor: 'transparent'
              }}
            >
              <span className="material-symbols-outlined">add</span>
            </button>
            <div style={{ height: '1px', backgroundColor: '#d4d4d8' }} />
            <button 
              onClick={() => mapInstance.current?.setLevel(mapInstance.current.getLevel() + 1)} 
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                backgroundColor: 'transparent'
              }}
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>
          <button 
            onClick={() => {
              console.log('📍 내 위치 버튼 클릭');
              
              if (!navigator.geolocation) {
                alert('위치 서비스를 사용할 수 없습니다.');
                return;
              }
              
              // 로딩 표시 (옵션)
              console.log('🔍 현재 위치 가져오는 중...');
              
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude, accuracy } = position.coords;
                  console.log(`✅ 현재 정확한 위치:`);
                  console.log(`   위도: ${latitude}`);
                  console.log(`   경도: ${longitude}`);
                  console.log(`   정확도: ±${Math.round(accuracy)}m`);
                  
                  if (mapInstance.current) {
                    // 지도 중심을 현재 위치로 이동
                    const currentPos = new window.kakao.maps.LatLng(latitude, longitude);
                    mapInstance.current.setCenter(currentPos);
                    mapInstance.current.setLevel(3);
                    
                    // 기존 내 위치 마커 제거 (중복 방지)
                    if (window.myLocationMarker) {
                      window.myLocationMarker.setMap(null);
                    }
                    
                    // 현재 위치에 커스텀 마커 표시 (계속 유지)
                    const markerContent = document.createElement('div');
                    markerContent.innerHTML = `
                      <div style="
                        position: relative;
                        width: 24px;
                        height: 24px;
                      ">
                        <!-- 펄스 링 -->
                        <div style="
                          position: absolute;
                          top: -8px;
                          left: -8px;
                          width: 40px;
                          height: 40px;
                          background: rgba(255, 107, 53, 0.3);
                          border-radius: 50%;
                          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
                        "></div>
                        <!-- 메인 핀 -->
                        <div style="
                          position: absolute;
                          width: 24px;
                          height: 24px;
                          background: linear-gradient(135deg, #ff6b35, #f7931e);
                          border: 3px solid white;
                          border-radius: 50%;
                          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                        "></div>
                      </div>
                    `;
                    
                    // CSS 애니메이션 추가 (한 번만)
                    if (!document.getElementById('myLocationPingStyle')) {
                      const style = document.createElement('style');
                      style.id = 'myLocationPingStyle';
                      style.textContent = `
                        @keyframes ping {
                          75%, 100% {
                            transform: scale(2);
                            opacity: 0;
                          }
                        }
                      `;
                      document.head.appendChild(style);
                    }
                    
                    const customOverlay = new window.kakao.maps.CustomOverlay({
                      position: currentPos,
                      content: markerContent,
                      yAnchor: 0.5
                    });
                    
                    customOverlay.setMap(mapInstance.current);
                    
                    // 전역 변수에 저장 (나중에 제거 가능하도록)
                    window.myLocationMarker = customOverlay;
                    
                    // 정확도 알림 (정확도가 50m 이상이면 경고)
                    if (accuracy > 50) {
                      console.log(`⚠️ 위치 정확도가 낮습니다: ±${Math.round(accuracy)}m`);
                    }
                    
                    console.log('✅ 지도 이동 완료! 내 위치 마커 표시 (계속 유지)');
                  }
                },
                (error) => {
                  console.error('❌ 위치 가져오기 실패:', error);
                  
                  let errorMessage = '위치를 가져올 수 없습니다.';
                  
                  switch (error.code) {
                    case error.PERMISSION_DENIED:
                      errorMessage = '위치 권한이 거부되었습니다.\n설정에서 위치 권한을 허용해주세요.';
                      break;
                    case error.POSITION_UNAVAILABLE:
                      errorMessage = '위치 정보를 사용할 수 없습니다.';
                      break;
                    case error.TIMEOUT:
                      errorMessage = '위치 요청 시간이 초과되었습니다.';
                      break;
                  }
                  
                  alert(errorMessage);
                },
                {
                  enableHighAccuracy: true, // 높은 정확도
                  timeout: 10000, // 10초 타임아웃
                  maximumAge: 0 // 캐시 사용 안 함
                }
              );
            }}
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              border: 'none'
            }}
          >
            <span className="material-symbols-outlined">my_location</span>
          </button>
        </div>
      </div>

      {/* 시트 열기 버튼 */}
      {!showSheet && (
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '100px',
          zIndex: 40,
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button 
            onClick={() => setShowSheet(true)} 
            className="bg-primary text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2"
          >
            <span className="material-symbols-outlined">photo_library</span>
            <span className="font-semibold">사진 다시 보기 ({visiblePins.length}개)</span>
          </button>
        </div>
      )}

      {/* 하단 시트 - 네비게이션 바로 위 (bottom: 80px + safe-area) */}
      {showSheet && (
        <div 
          ref={sheetRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
            height: '200px',
            backgroundColor: 'white',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
            zIndex: 40
          }}
        >
          {/* 드래그 핸들 */}
          <div 
            onPointerDown={sheetDragStart}
            onTouchStart={sheetDragStart}
            style={{
              padding: '16px',
              cursor: 'grab',
              touchAction: 'none',
              userSelect: 'none'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '64px',
                height: '6px',
                backgroundColor: '#d4d4d8',
                borderRadius: '9999px'
              }} />
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '24px' }}>📍</span>
                <span>주변 장소</span>
              </h3>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#ff6b35'
              }}>
                {visiblePins.length}개
              </span>
            </div>
          </div>

          {/* 사진 리스트 */}
          <div style={{ padding: '0 16px 16px 16px' }}>
            {visiblePins.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span className="material-symbols-outlined text-4xl text-zinc-400">add_location</span>
                <p style={{
                  fontSize: '14px',
                  color: '#71717a',
                  marginTop: '8px'
                }}>이 지역에 장소가 없어요</p>
                <p style={{
                  fontSize: '12px',
                  color: '#a1a1aa'
                }}>첫 번째 사진을 공유해보세요!</p>
                <button
                  onClick={() => navigate('/upload')}
                  className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg flex items-center gap-2 text-sm"
                >
                  <span className="material-symbols-outlined text-sm">add_a_photo</span>
                  첫 사진 올리기
                </button>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '8px'
              }}>
                {visiblePins.map((pin) => (
                  <button 
                    key={pin.id}
                    onClick={() => {
                      if (mapInstance.current) {
                        mapInstance.current.setCenter(new window.kakao.maps.LatLng(pin.lat, pin.lng));
                        mapInstance.current.setLevel(3);
                      }
                      navigate(`/post/${pin.id}`, { state: { post: pin.post } });
                    }}
                    style={{
                      flexShrink: 0,
                      border: 'none',
                      background: 'none',
                      padding: 0
                    }}
                  >
                    <div style={{ width: '96px', position: 'relative' }}>
                      <img 
                        src={pin.image} 
                        alt={pin.title} 
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                        borderRadius: '12px'
                      }} />
                      {pin.categoryName && (
                        <div style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px'
                        }}>
                          <span style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            backgroundColor: 'rgba(255,255,255,0.95)',
                            borderRadius: '9999px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            {pin.categoryName === '개화 상황' ? '🌸' : pin.categoryName === '맛집 정보' ? '🍜' : '🏞️'}
                          </span>
                        </div>
                      )}
                    </div>
                    <p style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      marginTop: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      width: '96px'
                    }}>{pin.title}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 검색 모달 */}
      {showSearch && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 50
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            backgroundColor: 'white',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            maxHeight: '75vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #e4e4e7'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>지역 검색</h2>
                <button 
                  onClick={() => setShowSearch(false)} 
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '9999px',
                    backgroundColor: '#e4e4e7',
                    border: 'none'
                  }}
                >
                  <span className="material-symbols-outlined text-zinc-600">close</span>
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <span 
                  className="material-symbols-outlined" 
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#71717a'
                  }}
                >search</span>
                <input 
                  type="text" 
                  value={searchQuery} 
                  onChange={handleSearchChange} 
                  style={{
                    width: '100%',
                    borderRadius: '9999px',
                    backgroundColor: '#f4f4f5',
                    padding: '12px 16px 12px 40px',
                    border: 'none'
                  }}
                  placeholder="지역을 검색하세요" 
                  autoFocus 
                />
              </div>
            </div>

            <div style={{
              padding: '16px',
              overflowY: 'auto'
            }}>
              {searchQuery && searchResults.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {searchResults.slice(0, 8).map((r, i) => (
                    <button 
                      key={i} 
                      onClick={() => selectRegion(r)} 
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '8px',
                        backgroundColor: '#f4f4f5',
                        border: 'none'
                      }}
                    >
                      <span className="material-symbols-outlined text-primary">location_on</span>
                      <span style={{ fontWeight: '600' }}>{r}</span>
                    </button>
                  ))}
                </div>
              ) : searchQuery ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '48px 0'
                }}>
                  <span className="material-symbols-outlined text-5xl text-zinc-300 mb-3">search_off</span>
                  <p style={{ color: '#71717a' }}>검색 결과가 없어요</p>
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '48px 0'
                }}>
                  <span className="material-symbols-outlined text-5xl text-zinc-300 mb-3">search</span>
                  <p style={{ color: '#71717a' }}>지역을 검색하세요</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 네비게이션 바 - 최하단 고정 */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50
      }}>
        <BottomNavigation />
      </div>
    </div>
  );
};

export default MapScreen;

