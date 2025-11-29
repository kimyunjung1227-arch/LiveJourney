import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/styles';
import { filterRecentPosts, getTimeAgo } from '../utils/timeUtils';
import { getUserDailyTitle, getTitleEffect, getAllTodayTitles, DAILY_TITLES } from '../utils/dailyTitleSystem';
import { ScreenLayout, ScreenContent, ScreenHeader, ScreenBody } from '../components/ScreenLayout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 180;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

const MainScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('자연');
  const [refreshing, setRefreshing] = useState(false);
  
  const [realtimeData, setRealtimeData] = useState([]);
  const [crowdedData, setCrowdedData] = useState([]);
  const [recommendedData, setRecommendedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [dailyTitle, setDailyTitle] = useState(null);
  const [allTodayTitles, setAllTodayTitles] = useState([]);
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [showTitleCelebration, setShowTitleCelebration] = useState(false);
  const [earnedTitle, setEarnedTitle] = useState(null);
  
  const categories = useMemo(() => ['자연', '힐링', '액티비티', '맛집', '카페'], []);
  
  // 카테고리별 보조 컬러 매핑
  const getCategoryColor = (category) => {
    const colorMap = {
      '자연': COLORS.secondary2,      // Green
      '힐링': COLORS.secondary7,       // Teal
      '액티비티': COLORS.secondary4,   // Deep Orange
      '맛집': COLORS.secondary3,       // Pink
      '카페': COLORS.secondary6,       // Indigo
    };
    return colorMap[category] || COLORS.primary;
  };
  
  const getCategoryColorSoft = (category) => {
    const colorMap = {
      '자연': COLORS.secondary2Soft,
      '힐링': COLORS.secondary7Soft,
      '액티비티': COLORS.secondary4Soft,
      '맛집': COLORS.secondary3Soft,
      '카페': COLORS.secondary6Soft,
    };
    return colorMap[category] || COLORS.primary + '20';
  };
  
  const filteredRecommendedData = useMemo(() => 
    recommendedData.filter(item => 
      item.category === selectedCategory || item.tags?.includes(selectedCategory)
    ),
    [recommendedData, selectedCategory]
  );
  
  // Mock 데이터 로드
  const loadMockData = useCallback(async () => {
    try {
      const postsJson = await AsyncStorage.getItem('uploadedPosts');
      let posts = postsJson ? JSON.parse(postsJson) : [];
      
      console.log(`📸 전체 게시물: ${posts.length}개`);
      
      // 최신순 정렬
      posts.sort((a, b) => {
        const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
        const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
        return timeB - timeA;
      });
      
      // 2일 이상 된 게시물 필터링 (메인 화면 표시용)
      posts = filterRecentPosts(posts, 2);
      console.log(`📊 전체 게시물 → 2일 이내 게시물: ${posts.length}개`);
      
      if (posts.length === 0) {
        setRealtimeData([]);
        setCrowdedData([]);
        setRecommendedData([]);
        return;
      }
      
      const realtimeFormatted = posts.slice(0, 30).map((post) => {
        const dynamicTime = getTimeAgo(post.timestamp || post.createdAt || post.time);
        
        return {
          id: post.id,
          images: post.images || [],
          videos: post.videos || [],
          image: post.images?.[0] || post.videos?.[0] || '',
          title: post.location,
          location: post.location,
          detailedLocation: post.detailedLocation || post.location,
          placeName: post.placeName || post.location,
          time: dynamicTime,
          timeLabel: dynamicTime,
          timestamp: post.timestamp || post.createdAt || post.time,
          user: post.user || '여행자',
          userId: post.userId,
          badge: post.categoryName || '여행러버',
          category: post.category,
          categoryName: post.categoryName,
          content: post.note || `${post.location}의 아름다운 순간!`,
          note: post.note,
          tags: post.tags || [],
          coordinates: post.coordinates,
          likes: post.likes || 0,
          comments: post.comments || [],
          questions: post.questions || [],
          qnaList: [],
          aiLabels: post.aiLabels
        };
      });
      
      // 1시간 이내 게시물만 필터링
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      const crowdedFormatted = posts
        .filter(post => {
          const postTime = new Date(post.timestamp || post.createdAt || post.time).getTime();
          return postTime > oneHourAgo;
        })
        .slice(0, 150)
        .map((post) => {
          const dynamicTime = getTimeAgo(post.timestamp || post.createdAt || post.time);
          
          return {
            id: post.id,
            images: post.images || [],
            videos: post.videos || [],
            image: post.images?.[0] || post.videos?.[0] || '',
            title: post.location,
            location: post.location,
            detailedLocation: post.detailedLocation || post.location,
            placeName: post.placeName || post.location,
            badge: '인기',
            category: post.category || '자연',
            categoryName: post.categoryName,
            time: dynamicTime,
            timeLabel: dynamicTime,
            timestamp: post.timestamp || post.createdAt || post.time,
            user: post.user || '여행자',
            userId: post.userId,
            content: post.note || `${post.location}의 인기 명소!`,
            note: post.note,
            tags: post.tags || [],
            coordinates: post.coordinates,
            likes: post.likes || 0,
            comments: post.comments || [],
            questions: post.questions || [],
            aiLabels: post.aiLabels
          };
        });
      
      const recommendedFormatted = posts.slice(0, 200).map((post, idx) => {
        const dynamicTime = getTimeAgo(post.timestamp || post.createdAt || post.time);
        
        let assignedCategory = '자연';
        if (post.category === 'food') {
          assignedCategory = idx % 2 === 0 ? '맛집' : '카페';
        } else if (post.category === 'landmark' || post.category === 'scenic') {
          assignedCategory = idx % 2 === 0 ? '자연' : '힐링';
        } else if (post.category === 'bloom') {
          assignedCategory = '힐링';
        } else {
          assignedCategory = '액티비티';
        }
        
        return {
          id: post.id,
          images: post.images || [],
          videos: post.videos || [],
          image: post.images?.[0] || post.videos?.[0] || '',
          title: post.location,
          location: post.location,
          detailedLocation: post.detailedLocation || post.location,
          placeName: post.placeName || post.location,
          badge: '추천',
          category: assignedCategory,
          categoryName: post.categoryName,
          tags: post.tags || [assignedCategory],
          time: dynamicTime,
          timeLabel: dynamicTime,
          timestamp: post.timestamp || post.createdAt || post.time,
          user: post.user || '여행자',
          userId: post.userId,
          content: post.note || `${post.location}의 아름다운 순간!`,
          note: post.note,
          coordinates: post.coordinates,
          likes: post.likes || 0,
          comments: post.comments || [],
          questions: post.questions || [],
          aiLabels: post.aiLabels
        };
      });
      
      setRealtimeData(realtimeFormatted);
      setCrowdedData(crowdedFormatted);
      setRecommendedData(recommendedFormatted);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  }, []);
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMockData();
    setRefreshing(false);
  }, [loadMockData]);
  
  // 오늘의 타이틀 로드
  const loadTodayTitles = useCallback(async () => {
    try {
      const titles = await getAllTodayTitles();
      setAllTodayTitles(titles);
      
      // 현재 사용자의 타이틀 확인
      const userId = 'test_user_001'; // TODO: 실제 사용자 ID로 변경
      const userTitle = await getUserDailyTitle(userId);
      setDailyTitle(userTitle);
      
      // 새로 획득한 타이틀 확인
      const newlyEarned = await AsyncStorage.getItem('newlyEarnedTitle');
      if (newlyEarned) {
        const titleData = JSON.parse(newlyEarned);
        setEarnedTitle(titleData);
        setShowTitleCelebration(true);
        await AsyncStorage.removeItem('newlyEarnedTitle');
      }
    } catch (error) {
      console.error('타이틀 로드 실패:', error);
    }
  }, []);

  useEffect(() => {
    console.log('📱 메인화면 진입 - 초기 데이터 로드');
    
    // Mock 데이터 즉시 로드
    loadMockData();
    loadTodayTitles();
    
    // 오늘의 타이틀 로드
    const loadUserTitle = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : {};
        if (user?.id) {
          const title = await getUserDailyTitle(user.id);
          setDailyTitle(title);
        }
      } catch (error) {
        console.error('사용자 타이틀 로드 실패:', error);
      }
    };
    loadUserTitle();
    
    // 타이틀 업데이트 이벤트 리스너
    const handleTitleUpdate = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        const user = userJson ? JSON.parse(userJson) : {};
        if (user?.id) {
          const previousTitle = dailyTitle;
          const title = await getUserDailyTitle(user.id);
          setDailyTitle(title);
          
          // 새로 타이틀을 획득한 경우 축하 모달 표시
          if (title && (!previousTitle || previousTitle.name !== title.name)) {
            setEarnedTitle(title);
            setShowTitleCelebration(true);
          }
        }
        // 오늘의 모든 타이틀도 업데이트
        const todayTitles = await getAllTodayTitles();
        setAllTodayTitles(todayTitles);
      } catch (error) {
        console.error('타이틀 업데이트 실패:', error);
      }
    };
    
    // 게시물 업데이트 시 타이틀도 새로고침
    const handlePostsUpdateForTitles = async () => {
      setTimeout(async () => {
        const todayTitles = await getAllTodayTitles();
        setAllTodayTitles(todayTitles);
      }, 200);
    };
    
    // newPostsAdded 이벤트 리스너 (사진 업로드 시)
    const handleNewPosts = () => {
      console.log('🔄 새 게시물 추가됨 - 화면 업데이트!');
      setTimeout(() => {
        loadMockData();
      }, 100);
    };
    
    // postsUpdated 이벤트 리스너 (게시물 업데이트 시)
    const handlePostsUpdate = () => {
      console.log('📊 게시물 업데이트 - 화면 새로고침!');
      setTimeout(() => {
        loadMockData();
        handlePostsUpdateForTitles();
      }, 100);
    };
    
    // 이벤트 리스너 등록 (React Native에서는 DeviceEventEmitter 사용)
    // 웹과 동일한 이벤트 시스템을 위해 AsyncStorage 변경 감지 사용
    const checkStorageChanges = setInterval(() => {
      // AsyncStorage 변경 감지를 위한 폴링
      loadMockData();
      loadTodayTitles();
    }, 1000);
    
    // 자동 새로고침: 30초마다
    const autoRefreshInterval = setInterval(() => {
      console.log('⏰ 자동 새로고침 (30초) - 시간 업데이트');
      loadMockData();
      loadTodayTitles();
      const loadAllTitles = async () => {
        const todayTitles = await getAllTodayTitles();
        setAllTodayTitles(todayTitles);
      };
      loadAllTitles();
    }, 30000);
    
    return () => {
      clearInterval(autoRefreshInterval);
      clearInterval(checkStorageChanges);
    };
  }, [loadMockData, loadTodayTitles]);

  // 화면 포커스 시 데이터 새로고침 (업로드 후 메인 화면으로 돌아올 때)
  useFocusEffect(
    useCallback(() => {
      console.log('📱 메인 화면 포커스 - 데이터 새로고침');
      loadMockData();
    }, [loadMockData])
  );
  
  const handleItemPress = useCallback((item, sectionType = 'realtime') => {
    let allPosts = [];
    let currentIndex = 0;
    
    switch (sectionType) {
      case 'realtime':
        allPosts = realtimeData;
        currentIndex = realtimeData.findIndex(p => p.id === item.id);
        break;
      case 'crowded':
        allPosts = crowdedData;
        currentIndex = crowdedData.findIndex(p => p.id === item.id);
        break;
      case 'recommended':
        allPosts = filteredRecommendedData;
        currentIndex = filteredRecommendedData.findIndex(p => p.id === item.id);
        break;
      default:
        allPosts = [item];
        currentIndex = 0;
    }
    
    navigation.navigate('PostDetail', {
      postId: item.id,
      post: item,
      allPosts: allPosts,
      currentPostIndex: currentIndex >= 0 ? currentIndex : 0
    });
  }, [navigation, realtimeData, crowdedData, filteredRecommendedData]);
  
  const PostCard = ({ item, sectionType }) => {
    const [userTitle, setUserTitle] = useState(null);
    const [titleEffect, setTitleEffect] = useState(null);
    
    useEffect(() => {
      const loadTitle = async () => {
        const title = await getUserDailyTitle(item.userId);
        setUserTitle(title);
        if (title) {
          setTitleEffect(getTitleEffect(title.effect));
        }
      };
      loadTitle();
    }, [item.userId]);
    
    return (
      <TouchableOpacity
        style={styles.postCard}
        onPress={() => handleItemPress(item, sectionType)}
        activeOpacity={0.9}
      >
        <View style={[
          styles.postImageContainer,
          userTitle && styles.postImageContainerWithTitle
        ]}>
          {/* 타이틀 획득자 게시물 후광 효과 */}
          {userTitle && (
            <View style={styles.titleGlow} />
          )}
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.postImage, styles.postImagePlaceholder]}>
              <Ionicons name="image-outline" size={40} color={COLORS.textSubtle} />
            </View>
          )}
          
          {/* 그라데이션 오버레이 - 웹 버전과 동일: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3)) */}
          <View style={styles.gradientOverlayTop} />
          <View style={styles.gradientOverlayMiddle} />
          <View style={styles.gradientOverlayBottom} />
          
          {/* 우측상단: 24시간 타이틀 배지 - 웹 버전과 동일한 그라데이션 */}
          {userTitle && (
            <>
              {/* 배지 후광 효과 */}
              <View style={styles.titleBadgeGlow} />
              <LinearGradient
                colors={['#fbbf24', '#f97316', '#f59e0b', '#fbbf24']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.titleBadgeEnhanced}
              >
                <Text style={styles.titleBadgeIconEnhanced}>{userTitle.icon}</Text>
                <Text style={styles.titleBadgeTextEnhanced}>{titleEffect?.badge || '👑 VIP'}</Text>
              </LinearGradient>
            </>
          )}
          
          {/* 좌측하단: 위치정보 + 업로드시간 - 웹 버전과 동일: linear-gradient(to top, rgba(0,0,0,0.7), transparent) */}
          <View style={styles.postInfoContainer}>
            <View style={styles.postInfoGradient} />
            <View style={styles.postInfo}>
              {item.title && (
                <Text style={styles.postTitle} numberOfLines={1}>
                  {item.title}
                </Text>
              )}
              {item.time && (
                <Text style={styles.postTime} numberOfLines={1}>
                  {item.time}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPostCard = useCallback(({ item, sectionType }) => {
    return <PostCard item={item} sectionType={sectionType} />;
  }, [handleItemPress]);
  
  const renderSection = useCallback((title, data, sectionType, showMore = true) => {
    if (data.length === 0) {
      const emptyMessages = {
        '지금 여기는!': {
          icon: 'travel-explore',
          title: '아직 지금 이곳의 모습이 올라오지 않았어요',
          subtitle: '지금 보고 있는 장소와 분위기, 날씨가 보이도록 한 장만 남겨 주세요',
        },
        '지금 사람 많은 곳!': {
          icon: 'people',
          title: '아직 밀집 지역 정보가 없어요',
          subtitle: '첫 번째로 현장 정보를 공유해보세요!',
        },
        '추천 장소': {
          icon: 'recommend',
          title: '추천 장소가 아직 없어요',
          subtitle: '첫 번째로 추천 장소를 공유해보세요!',
        },
        // 이전 타이틀도 지원 (하위 호환성)
        '실시간 정보': {
          icon: 'travel-explore',
          title: '아직 지금 이곳의 모습이 올라오지 않았어요',
          subtitle: '지금 보고 있는 장소와 분위기, 날씨가 보이도록 한 장만 남겨 주세요',
        },
        '실시간 밀집 지역': {
          icon: 'people',
          title: '아직 밀집 지역 정보가 없어요',
          subtitle: '첫 번째로 현장 정보를 공유해보세요!',
        },
      };
      
      const message = emptyMessages[title] || {
        icon: 'images-outline',
        title: '아직 공유된 여행 정보가 없어요',
        subtitle: '첫 번째로 여행 정보를 공유해보세요!',
      };
      
      return (
        <View style={styles.emptySection}>
          <Ionicons name={message.icon} size={64} color={COLORS.textSubtle} />
          <Text style={styles.emptyText}>{message.title}</Text>
          <Text style={styles.emptySubtext}>{message.subtitle}</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Upload')}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.emptyButtonText}>첫 사진 올리기</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {showMore && (
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreButtonText}>더보기</Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={data}
          renderItem={({ item }) => renderPostCard({ item, sectionType })}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          snapToInterval={CARD_WIDTH + 12}
          decelerationRate="fast"
          snapToAlignment="start"
        />
      </>
    );
  }, [renderPostCard, navigation]);
  
  return (
    <ScreenLayout>
      <ScreenContent 
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 상단 헤더 - 웹과 동일한 구조 */}
        <ScreenHeader>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>LiveJourney</Text>
          <View style={styles.headerRight}>
            {/* 타이틀 축하 버튼 */}
            {dailyTitle && (
              <TouchableOpacity
                style={styles.titleButton}
                onPress={() => {
                  setEarnedTitle(dailyTitle);
                  setShowTitleCelebration(true);
                }}
              >
                <Text style={styles.titleButtonIcon}>{dailyTitle.icon || '👑'}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={26} color={COLORS.text} />
              {unreadNotificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <View style={styles.notificationDot} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* 검색창 */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color={COLORS.primary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="어디로 떠나볼까요? 🌏"
            placeholderTextColor={COLORS.textSubtle}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => navigation.navigate('Search')}
          />
        </View>
        </ScreenHeader>
        
        {/* 메인 컨텐츠 - 웹과 동일한 구조 */}
        <ScreenBody>
          {/* 오늘의 타이틀 목록 - 실시간 정보 위에 눈에 띄게 표시 */}
        <View style={styles.titleSection}>
          <View style={styles.titleSectionHeader}>
            <View>
              <View style={styles.titleSectionTitleRow}>
                <Text style={styles.titleSectionIcon}>👑</Text>
                <Text style={styles.titleSectionTitle}>오늘의 타이틀</Text>
                <Text style={styles.titleSectionCount}>({allTodayTitles.length}개)</Text>
              </View>
              <Text style={styles.titleSectionSubtitle}>
                타이틀을 클릭하면 획득 조건을 확인할 수 있어요
              </Text>
            </View>
            <TouchableOpacity
              style={styles.titleViewAllButton}
              onPress={() => setShowTitleModal(true)}
            >
              <Text style={styles.titleViewAllButtonText}>모아보기</Text>
            </TouchableOpacity>
          </View>
          {allTodayTitles.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.titleList}
            >
              {allTodayTitles.map((item, index) => (
                <TouchableOpacity
                  key={`${item.userId}-${index}`}
                  style={styles.titleCard}
                  onPress={() => {
                    setSelectedTitle(item.title);
                    setShowTitleModal(true);
                  }}
                >
                  <Text style={styles.titleCardIcon}>{item.title.icon || '👑'}</Text>
                  <View style={styles.titleCardContent}>
                    <Text style={styles.titleCardName}>{item.title.name}</Text>
                    <Text style={styles.titleCardCategory}>{item.title.category}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.titleEmpty}>
              <Text style={styles.titleEmptyText}>
                아직 오늘 획득한 타이틀이 없습니다. 활동을 시작해보세요!
              </Text>
            </View>
          )}
        </View>

        {/* 실시간 정보 섹션 */}
        <View style={[styles.section, { marginTop: 20 }]}> {/* pt-5 = 20px */}
          {renderSection('지금 여기는!', realtimeData, 'realtime')}
        </View>
        
        {/* 실시간 밀집 지역 섹션 */}
        <View style={[styles.section, { marginTop: 32 }]}> {/* pt-8 = 32px */}
          {renderSection('지금 사람 많은 곳!', crowdedData, 'crowded')}
        </View>
        
        {/* 추천 장소 섹션 */}
        <View style={[styles.section, { marginTop: 32 }]}> {/* pt-8 = 32px */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>추천 장소</Text>
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreButtonText}>더보기</Text>
            </TouchableOpacity>
          </View>
          
          {/* 카테고리 필터 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryFilter}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && [
                    styles.categoryButtonActive,
                    { backgroundColor: getCategoryColorSoft(category) }
                  ]
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && [
                      styles.categoryButtonTextActive,
                      { color: getCategoryColor(category) }
                    ]
                  ]}
                >
                  #{category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {filteredRecommendedData.length === 0 ? (
            <View style={styles.emptySection}>
              <Ionicons name="images-outline" size={48} color={COLORS.textSubtle} />
              <Text style={styles.emptyText}>아직 공유된 여행 정보가 없어요</Text>
            </View>
          ) : (
            <FlatList
              data={filteredRecommendedData}
              renderItem={({ item }) => renderPostCard({ item, sectionType: 'recommended' })}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              snapToInterval={CARD_WIDTH + 12}
              decelerationRate="fast"
              snapToAlignment="start"
            />
          )}
        </View>
        </ScreenBody>

        {/* 오늘의 타이틀 모달 */}
        {showTitleModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Text style={styles.modalHeaderIcon}>👑</Text>
                <Text style={styles.modalHeaderTitle}>오늘의 타이틀</Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  setShowTitleModal(false);
                  setSelectedTitle(null);
                }}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {selectedTitle ? (
                <View style={styles.modalTitleDetail}>
                  <View style={styles.modalTitleDetailCard}>
                    <Text style={styles.modalTitleDetailIcon}>{selectedTitle.icon || '👑'}</Text>
                    <View style={styles.modalTitleDetailContent}>
                      <Text style={styles.modalTitleDetailName}>{selectedTitle.name}</Text>
                      <Text style={styles.modalTitleDetailCategory}>{selectedTitle.category}</Text>
                    </View>
                  </View>
                  <View style={styles.modalTitleDescription}>
                    <Text style={styles.modalTitleDescriptionTitle}>획득 조건</Text>
                    <Text style={styles.modalTitleDescriptionText}>{selectedTitle.description}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.modalBackButton}
                    onPress={() => setSelectedTitle(null)}
                  >
                    <Text style={styles.modalBackButtonText}>목록으로 돌아가기</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  {/* 획득한 타이틀 */}
                  {allTodayTitles.length > 0 && (
                    <View style={styles.modalEarnedSection}>
                      <Text style={styles.modalSectionTitle}>
                        획득한 타이틀 ({allTodayTitles.length}개)
                      </Text>
                      {allTodayTitles.map((item, index) => (
                        <TouchableOpacity
                          key={`${item.userId}-${index}`}
                          style={styles.modalTitleItem}
                          onPress={() => setSelectedTitle(item.title)}
                        >
                          <Text style={styles.modalTitleItemIcon}>{item.title.icon || '👑'}</Text>
                          <View style={styles.modalTitleItemContent}>
                            <Text style={styles.modalTitleItemName}>{item.title.name}</Text>
                            <Text style={styles.modalTitleItemCategory}>{item.title.category}</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={20} color={COLORS.textSubtle} />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* 모든 타이틀 목록 */}
                  <View style={styles.modalAllSection}>
                    <Text style={styles.modalSectionTitle}>
                      모든 타이틀 목록 ({Object.keys(DAILY_TITLES).length}개)
                    </Text>
                    {Object.values(DAILY_TITLES).map((title, index) => {
                      const isEarned = allTodayTitles.some(item => item.title.name === title.name);
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.modalTitleItem,
                            isEarned && styles.modalTitleItemEarned
                          ]}
                          onPress={() => setSelectedTitle(title)}
                        >
                          <Text style={styles.modalTitleItemIcon}>{title.icon || '👑'}</Text>
                          <View style={styles.modalTitleItemContent}>
                            <Text style={[
                              styles.modalTitleItemName,
                              isEarned && styles.modalTitleItemNameEarned
                            ]}>
                              {title.name}
                              {isEarned && <Text style={styles.modalTitleItemCheck}> ✓ 획득</Text>}
                            </Text>
                            <Text style={[
                              styles.modalTitleItemCategory,
                              isEarned && styles.modalTitleItemCategoryEarned
                            ]}>
                              {title.category}
                            </Text>
                          </View>
                          <Ionicons name="chevron-forward" size={20} color={COLORS.textSubtle} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
        )}

        {/* 타이틀 획득 축하 모달 - 뱃지와 다른 심플한 스타일 */}
        {showTitleCelebration && earnedTitle && (
        <View style={styles.celebrationOverlay}>
          <View style={styles.celebrationContent}>
            <View style={styles.celebrationIconContainer}>
              <View style={styles.celebrationIconCircle}>
                <Text style={styles.celebrationIcon}>{earnedTitle.icon || '👑'}</Text>
              </View>
              <View style={styles.celebrationBadge}>
                <Text style={styles.celebrationBadgeText}>VIP</Text>
              </View>
            </View>
            <Text style={styles.celebrationTitle}>축하합니다!</Text>
            <Text style={styles.celebrationName}>{earnedTitle.name}</Text>
            <View style={styles.celebrationCategoryContainer}>
              <View style={styles.celebrationCategoryBadge}>
                <Text style={styles.celebrationCategoryText}>
                  {earnedTitle.category || '24시간 타이틀'}
                </Text>
              </View>
            </View>
            <Text style={styles.celebrationDescription}>{earnedTitle.description}</Text>
            <TouchableOpacity
              style={styles.celebrationButton}
              onPress={() => {
                setShowTitleCelebration(false);
                setEarnedTitle(null);
              }}
            >
              <Text style={styles.celebrationButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
        )}
      </ScreenContent>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.backgroundLight, // bg-white
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '80', // border-border-light/50
    paddingHorizontal: SPACING.md, // px-4
    paddingTop: 12, // py-3 = 12px
    paddingBottom: 12, // py-3 = 12px
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm, // gap-2 = 8px
  },
  headerTitle: {
    fontSize: 20, // text-xl = 20px
    fontWeight: 'bold',
    color: COLORS.text, // text-text-light
    letterSpacing: -0.3, // tracking-[-0.015em] = -0.3px
    lineHeight: 24, // leading-tight
  },
  notificationButton: {
    width: 44, // w-11 h-11 = 44px
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12, // rounded-lg
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6, // top-1.5 = 6px
    right: 6, // right-1.5 = 6px
    width: 10, // h-2.5 w-2.5 = 10px
    height: 10,
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary, // bg-primary
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight, // bg-white
    borderRadius: 999, // rounded-full
    height: 56, // h-14 = 56px
    paddingHorizontal: 0,
    paddingVertical: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // shadow-lg
    borderWidth: 2, // ring-2
    borderColor: COLORS.primary + '4D', // ring-primary/30
  },
  searchIcon: {
    paddingLeft: SPACING.lg, // pl-5 = 20px
    paddingRight: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    padding: 0,
    paddingLeft: SPACING.sm, // pl-2
    paddingRight: SPACING.md, // px-4
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 32, // pt-8 = 32px
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm, // pb-3 = 12px
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    letterSpacing: -0.33, // tracking-[-0.015em] = -0.33px
    lineHeight: 26.4, // leading-tight
  },
  moreButton: {
    minWidth: 84, // min-w-[84px]
    maxWidth: 480, // max-w-[480px]
    height: 40, // h-10 = 40px
    paddingHorizontal: SPACING.md, // px-4
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8, // rounded-lg
    backgroundColor: 'transparent', // bg-transparent
  },
  moreButtonText: {
    fontSize: 14, // text-sm
    fontWeight: 'bold',
    color: COLORS.textSubtle, // text-text-subtle-light
    letterSpacing: 0.21, // tracking-[0.015em] = 0.21px
    lineHeight: 20, // leading-normal
  },
  categoryFilter: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  categoryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 999, // rounded-full
    backgroundColor: COLORS.borderLight,
    flexShrink: 0,
  },
  categoryButtonActive: {
    // backgroundColor는 동적으로 설정됨
    transform: [{ scale: 1.05 }], // scale-105
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSubtle,
  },
  categoryButtonTextActive: {
    // color는 동적으로 설정됨
  },
  horizontalList: {
    paddingHorizontal: SPACING.md, // px-4
    paddingBottom: SPACING.sm, // pb-2
  },
  postCard: {
    width: CARD_WIDTH,
    marginRight: 12, // gap-3 = 12px
  },
  postImageContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.borderLight,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postImagePlaceholder: {
    backgroundColor: COLORS.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 그라데이션 오버레이 - 웹 버전과 동일하게 구현
  gradientOverlayTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  gradientOverlayMiddle: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 1,
  },
  gradientOverlayBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1,
  },
  categoryIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  categoryEmoji: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  postInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  postInfoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  postInfo: {
    padding: 12, // padding: '12px'
    gap: 6, // gap: '6px' (웹 버전과 동일)
  },
  postTitle: {
    color: 'white',
    fontSize: 14, // fontSize: '14px'
    fontWeight: 'bold',
    lineHeight: 16.8, // lineHeight: '1.2' = 16.8px
    marginBottom: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8, // textShadow: '0 2px 8px rgba(0,0,0,0.8)'
  },
  postTime: {
    color: 'rgba(255,255,255,0.9)', // color: 'rgba(255,255,255,0.9)'
    fontSize: 12, // fontSize: '12px'
    fontWeight: '600',
    lineHeight: 14.4, // lineHeight: '1.2' = 14.4px
    marginTop: 0, // gap으로 처리하므로 marginTop 제거
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8, // textShadow: '0 2px 8px rgba(0,0,0,0.8)'
  },
  emptySection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl, // py-12 = 48px
    paddingHorizontal: SPACING.md, // px-4 = 16px
    width: '100%',
  },
  emptyText: {
    marginTop: SPACING.md, // mb-4 = 16px
    fontSize: 16, // text-base = 16px
    color: COLORS.textSecondary, // text-gray-500
    fontWeight: '500', // font-medium
    textAlign: 'center',
    marginBottom: SPACING.xs, // mb-2 = 8px
  },
  emptySubtext: {
    fontSize: 14, // text-sm = 14px
    color: COLORS.textSubtle, // text-gray-400
    textAlign: 'center',
    marginBottom: SPACING.md, // mb-4 = 16px
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm, // gap-2 = 8px
    backgroundColor: COLORS.primary, // bg-primary
    paddingHorizontal: SPACING.lg, // px-6 = 24px
    paddingVertical: 12, // py-3 = 12px (웹과 동일)
    borderRadius: 999, // rounded-full
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // shadow-lg
  },
  emptyButtonText: {
    fontSize: 16, // text-base = 16px
    fontWeight: '600', // font-semibold
    color: 'white',
  },
  // 타이틀 관련 스타일
  titleButton: {
    width: 44, // w-11 h-11 = 44px
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12, // rounded-lg
    backgroundColor: '#FEF3C7', // from-amber-100
    borderWidth: 1,
    borderColor: '#FCD34D', // border-amber-300
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleButtonIcon: {
    fontSize: 20, // text-xl = 20px
  },
  titleSection: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: '#FFFBEB', // from-amber-50/50
  },
  titleSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  titleSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  titleSectionIcon: {
    fontSize: 18, // text-lg = 18px
  },
  titleSectionTitle: {
    fontSize: 14, // text-sm = 14px
    fontWeight: 'bold',
    color: COLORS.text, // text-text-light
  },
  titleSectionCount: {
    fontSize: 12, // text-xs = 12px
    fontWeight: 'normal',
    color: COLORS.textSubtle, // text-gray-500
    marginLeft: SPACING.xs, // ml-1
  },
  titleSectionSubtitle: {
    fontSize: 12, // text-xs = 12px
    color: COLORS.textSubtle, // text-gray-600
    marginTop: SPACING.xs, // mt-1
  },
  titleViewAllButton: {
    paddingHorizontal: SPACING.md, // px-3 = 12px
    paddingVertical: 6, // py-1.5 = 6px
    borderRadius: 8, // rounded-lg
    backgroundColor: '#FEF3C7', // from-amber-100
    borderWidth: 1,
    borderColor: '#FCD34D', // border-amber-300
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleViewAllButtonText: {
    fontSize: 12, // text-xs = 12px
    fontWeight: '600', // font-semibold
    color: '#92400E', // text-amber-900
  },
  titleList: {
    gap: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  titleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10, // py-2.5 = 10px
    borderRadius: 12, // rounded-xl
    backgroundColor: '#FEF3C7', // from-amber-100
    borderWidth: 2,
    borderColor: '#FCD34D', // border-amber-300
    marginRight: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleCardIcon: {
    fontSize: 18, // text-lg = 18px
  },
  titleCardContent: {
    flexDirection: 'column',
    gap: 0,
  },
  titleCardName: {
    fontSize: 12, // text-xs = 12px
    fontWeight: 'bold',
    color: '#92400E', // text-amber-900
    lineHeight: 14.4, // leading-tight = 1.2 * 12
  },
  titleCardCategory: {
    fontSize: 10, // text-[10px] = 10px
    color: '#B45309', // text-amber-700/70
    lineHeight: 12, // leading-tight = 1.2 * 10
  },
  titleEmpty: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  titleEmptyText: {
    fontSize: 12,
    color: COLORS.textSubtle,
    textAlign: 'center',
  },
  postImageContainerWithTitle: {
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 10,
  },
  titleGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.3)',
    zIndex: -1,
    opacity: 0.75,
  },
  titleBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    zIndex: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  titleBadgeGlow: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    backgroundColor: 'rgba(251, 191, 36, 0.4)',
    zIndex: 29,
    opacity: 0.6,
  },
  titleBadgeEnhanced: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 9999,
    zIndex: 30,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ scale: 1.1 }],
  },
  titleBadgeIcon: {
    fontSize: 12,
  },
  titleBadgeIconEnhanced: {
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  titleBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  titleBadgeTextEnhanced: {
    fontSize: 12,
    fontWeight: '900',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  // 모달 스타일
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    padding: SPACING.md,
  },
  modalContent: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  modalHeaderIcon: {
    fontSize: 20,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  modalBody: {
    padding: SPACING.md,
    maxHeight: '80%',
  },
  modalTitleDetail: {
    gap: SPACING.md,
  },
  modalTitleDetailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    borderWidth: 2,
    borderColor: '#FCD34D',
  },
  modalTitleDetailIcon: {
    fontSize: 48,
  },
  modalTitleDetailContent: {
    flex: 1,
    gap: SPACING.xs,
  },
  modalTitleDetailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400E',
  },
  modalTitleDetailCategory: {
    fontSize: 14,
    color: '#B45309',
  },
  modalTitleDescription: {
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  modalTitleDescriptionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  modalTitleDescriptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  modalBackButton: {
    padding: SPACING.md,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  modalBackButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  modalEarnedSection: {
    marginBottom: SPACING.lg,
  },
  modalAllSection: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  modalTitleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  modalTitleItemEarned: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
  },
  modalTitleItemIcon: {
    fontSize: 24,
  },
  modalTitleItemContent: {
    flex: 1,
    gap: 4,
  },
  modalTitleItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalTitleItemNameEarned: {
    color: '#92400E',
  },
  modalTitleItemCategory: {
    fontSize: 12,
    color: COLORS.textSubtle,
  },
  modalTitleItemCategoryEarned: {
    color: '#B45309',
  },
  modalTitleItemCheck: {
    fontSize: 12,
    color: '#059669',
  },
  // 축하 모달 스타일
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000,
    padding: SPACING.md,
  },
  celebrationContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFF5F0',
    borderRadius: 24,
    padding: SPACING.xl,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  celebrationIconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  celebrationIconCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationIcon: {
    fontSize: 64,
  },
  celebrationBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
  },
  celebrationBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  celebrationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  celebrationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  celebrationDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  celebrationButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  celebrationButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  celebrationCategoryContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  celebrationCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: COLORS.primary + '1A',
    borderWidth: 1,
    borderColor: COLORS.primary + '4D',
  },
  celebrationCategoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default MainScreen;
