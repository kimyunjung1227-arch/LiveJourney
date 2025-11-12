// AI 이미지 분석 및 해시태그 자동 생성
// 클라이언트 측에서 이미지를 분석하여 관련 해시태그를 생성합니다

// 한국 여행 관련 키워드 데이터베이스
const koreanTravelKeywords = {
  // 자연 & 풍경
  nature: ['자연', '풍경', '산', '바다', '강', '호수', '계곡', '폭포', '숲', '들판', '하늘', '구름', '일몰', '일출', '별'],
  
  // 계절
  seasons: ['봄', '여름', '가을', '겨울', '벚꽃', '단풍', '눈', '꽃'],
  
  // 음식
  food: ['맛집', '음식', '카페', '디저트', '커피', '한식', '양식', '일식', '중식', '분식', '길거리음식', '전통음식'],
  
  // 활동
  activities: ['여행', '나들이', '힐링', '휴식', '산책', '등산', '캠핑', '수영', '서핑', '스키', '드라이브'],
  
  // 장소 유형
  places: ['관광지', '명소', '공원', '해변', '항구', '시장', '박물관', '미술관', '사찰', '성당', '궁궐', '한옥마을'],
  
  // 분위기
  mood: ['아름다운', '평화로운', '활기찬', '낭만적인', '고즈넉한', '시원한', '따뜻한', '청량한'],
  
  // 지역별 특징
  regions: {
    서울: ['도시', '야경', '쇼핑', '문화', '한강', '궁궐'],
    부산: ['바다', '해운대', '광안리', '항구', '해산물', '야경'],
    제주: ['섬', '바다', '오름', '한라산', '감귤', '돌하르방'],
    강릉: ['바다', '커피', '해변', '경포대', '정동진'],
    전주: ['한옥', '한식', '비빔밥', '전통'],
    경주: ['역사', '문화재', '신라', '불국사', '첨성대']
  }
};

// 이미지 파일에서 EXIF 데이터 읽기
const readExifData = async (file) => {
  return new Promise((resolve) => {
    try {
      // EXIF 라이브러리 없이 기본 정보만 추출
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          fileSize: file.size,
          fileType: file.type,
          fileName: file.name,
          lastModified: new Date(file.lastModified)
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      resolve({});
    }
  });
};

// 파일명에서 키워드 추출
const extractKeywordsFromFilename = (filename) => {
  const keywords = [];
  const name = filename.toLowerCase().replace(/\.(jpg|jpeg|png|gif|heic)$/i, '');
  
  // 일반적인 키워드 패턴
  if (name.includes('img') || name.includes('photo') || name.includes('pic')) {
    // 기본 이미지 파일명은 무시
  } else {
    // 파일명에서 의미있는 단어 추출 가능
    const words = name.split(/[_-\s]+/);
    keywords.push(...words.filter(w => w.length > 2));
  }
  
  return keywords;
};

// 이미지 밝기 분석 (초고속 분석)
const analyzeImageBrightness = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // 매우 작은 크기로 초고속 분석 (10x10)
          const size = 10;
          canvas.width = size;
          canvas.height = size;
          
          ctx.drawImage(img, 0, 0, size, size);
          const imageData = ctx.getImageData(0, 0, size, size);
          const data = imageData.data;
          
          let brightness = 0;
          // 4픽셀마다 샘플링 (더 빠름)
          for (let i = 0; i < data.length; i += 16) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            brightness += avg;
          }
          brightness = brightness / (size * size / 4);
          
          resolve({
            brightness: brightness / 255,
            isDark: brightness < 80,
            isBright: brightness > 180
          });
        } catch (error) {
          resolve({ brightness: 0.5, isDark: false, isBright: false });
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

// 위치 기반 키워드 생성
const generateLocationKeywords = (location) => {
  const keywords = [];
  
  if (!location) return keywords;
  
  // 지역별 특징 키워드
  Object.keys(koreanTravelKeywords.regions).forEach(region => {
    if (location.includes(region)) {
      keywords.push(...koreanTravelKeywords.regions[region]);
    }
  });
  
  // 일반적인 위치 관련 키워드
  if (location.includes('산') || location.includes('봉')) {
    keywords.push('산', '등산', '자연', '힐링');
  }
  if (location.includes('바다') || location.includes('해변') || location.includes('해수욕장')) {
    keywords.push('바다', '해변', '여름', '시원한');
  }
  if (location.includes('강') || location.includes('천')) {
    keywords.push('강', '자연', '힐링');
  }
  if (location.includes('공원')) {
    keywords.push('공원', '산책', '힐링', '자연');
  }
  if (location.includes('시장')) {
    keywords.push('시장', '맛집', '음식', '전통');
  }
  if (location.includes('한옥') || location.includes('고궁') || location.includes('궁')) {
    keywords.push('한옥', '전통', '역사', '문화');
  }
  if (location.includes('카페') || location.includes('cafe')) {
    keywords.push('카페', '커피', '디저트', '휴식');
  }
  
  return keywords;
};

// 계절 감지 (현재 날짜 기반)
const detectSeason = () => {
  const month = new Date().getMonth() + 1;
  
  if (month >= 3 && month <= 5) {
    return ['봄', '벚꽃', '꽃'];
  } else if (month >= 6 && month <= 8) {
    return ['여름', '바다', '시원한'];
  } else if (month >= 9 && month <= 11) {
    return ['가을', '단풍', '낙엽'];
  } else {
    return ['겨울', '눈', '따뜻한'];
  }
};

// 카테고리 자동 분류 (3가지)
const detectCategory = (keywords, location, note, brightness) => {
  const keywordList = Array.from(keywords);
  const allText = `${keywordList.join(' ')} ${location} ${note}`.toLowerCase();
  
  // 1. 개화 상황 🌸
  const bloomKeywords = ['꽃', '벚꽃', '개화', '봄', '매화', '진달래', '철쭉', '튤립', '유채', '수국', '코스모스', '해바라기'];
  if (bloomKeywords.some(kw => allText.includes(kw))) {
    return { category: 'bloom', categoryName: '개화 상황', icon: '🌸' };
  }
  
  // 2. 맛집 정보 🍜
  const foodKeywords = ['맛집', '음식', '카페', '커피', '디저트', '레스토랑', '식당', '먹', '요리', '메뉴', '빵', '케이크'];
  if (foodKeywords.some(kw => allText.includes(kw))) {
    return { category: 'food', categoryName: '맛집 정보', icon: '🍜' };
  }
  
  // 3. 추천 장소 🏞️ (기본값)
  return { category: 'scenic', categoryName: '추천 장소', icon: '🏞️' };
};

// 이미지 색상 분석 (고급)
const analyzeImageColors = async (imageFile) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // 50x50 크기로 샘플링 (더 정확한 분석)
          const size = 50;
          canvas.width = size;
          canvas.height = size;
          
          ctx.drawImage(img, 0, 0, size, size);
          const imageData = ctx.getImageData(0, 0, size, size);
          const data = imageData.data;
          
          let r = 0, g = 0, b = 0;
          let brightness = 0;
          const pixels = data.length / 4;
          
          // 모든 픽셀 분석
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
          }
          
          r = Math.floor(r / pixels);
          g = Math.floor(g / pixels);
          b = Math.floor(b / pixels);
          brightness = brightness / pixels;
          
          // 색상 특징 분석
          const isGreen = g > r && g > b && g > 100; // 초록색 우세 (자연)
          const isBlue = b > r && b > g && b > 100; // 파란색 우세 (하늘, 바다)
          const isRed = r > g && r > b && r > 100; // 빨간색 우세 (단풍, 음식)
          const isYellow = r > 150 && g > 150 && b < 100; // 노란색 (가을, 음식)
          
          resolve({
            brightness: brightness / 255,
            isDark: brightness < 80,
            isBright: brightness > 180,
            dominantColor: { r, g, b },
            isGreen,
            isBlue,
            isRed,
            isYellow
          });
        } catch (error) {
          resolve({ brightness: 0.5, isDark: false, isBright: false });
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(imageFile);
  });
};

// 메인 AI 분석 함수 (정교한 버전)
export const analyzeImageForTags = async (imageFile, location = '', existingNote = '') => {
  try {
    console.log('🤖 AI 이미지 분석 시작...');
    console.log('  📍 위치:', location);
    console.log('  📝 노트:', existingNote);
    
    const keywords = new Set();
    
    // 병렬 처리로 속도 향상
    const [colorAnalysis, exifData] = await Promise.all([
      analyzeImageColors(imageFile),
      readExifData(imageFile)
    ]);
    
    console.log('🎨 색상 분석 결과:');
    console.log('  RGB:', colorAnalysis.dominantColor);
    console.log('  밝기:', (colorAnalysis.brightness * 100).toFixed(1) + '%');
    console.log('  초록색:', colorAnalysis.isGreen);
    console.log('  파란색:', colorAnalysis.isBlue);
    console.log('  빨간색:', colorAnalysis.isRed);
    console.log('  노란색:', colorAnalysis.isYellow);
    console.log('  어두움:', colorAnalysis.isDark);
    console.log('  밝음:', colorAnalysis.isBright);
    
    // 우선순위 1: 위치 기반 키워드 (가장 중요!)
    const locationKeywords = generateLocationKeywords(location);
    if (locationKeywords.length > 0) {
      locationKeywords.slice(0, 4).forEach(kw => keywords.add(kw));
    }
    
    // 우선순위 2: 노트 내용 분석 (사용자가 직접 입력한 내용)
    if (existingNote && existingNote.trim().length > 0) {
      Object.values(koreanTravelKeywords).forEach(categoryKeywords => {
        if (Array.isArray(categoryKeywords)) {
          categoryKeywords.forEach(keyword => {
            if (existingNote.includes(keyword)) {
              keywords.add(keyword);
            }
          });
        }
      });
    }
    
    // 우선순위 3: 색상 분석 (실제 이미지 특성)
    // 색상이 명확할 때만 추가 (임계값 강화)
    const { r, g, b } = colorAnalysis.dominantColor || { r: 128, g: 128, b: 128 };
    const colorDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(b - r));
    
    // 색상 차이가 뚜렷한 경우만 (30 이상)
    if (colorDiff > 30) {
      if (colorAnalysis.isGreen && g > 120) {
        keywords.add('자연');
        keywords.add('숲');
      }
      if (colorAnalysis.isBlue && b > 120) {
        keywords.add('하늘');
        if (location.includes('바다') || location.includes('해')) {
          keywords.add('바다');
        }
      }
      if (colorAnalysis.isRed && r > 150) {
        // 빨간색 + 가을철만 단풍 추천
        const month = new Date().getMonth() + 1;
        if (month >= 9 && month <= 11) {
          keywords.add('단풍');
          keywords.add('가을');
        } else {
          keywords.add('활기찬');
        }
      }
      if (colorAnalysis.isYellow && r > 150 && g > 150) {
        keywords.add('따뜻한');
      }
    }
    
    // 우선순위 4: 밝기 분석
    if (colorAnalysis.isDark) {
      keywords.add('야경');
    } else if (colorAnalysis.isBright) {
      keywords.add('맑은');
    }
    
    // 우선순위 5: 계절 키워드 (위치/노트에 관련 내용이 있을 때만)
    const month = new Date().getMonth() + 1;
    const allText = `${location} ${existingNote}`.toLowerCase();
    
    if ((month >= 3 && month <= 5) && (allText.includes('꽃') || allText.includes('벚꽃'))) {
      keywords.add('봄');
    } else if ((month >= 6 && month <= 8) && allText.includes('바다')) {
      keywords.add('여름');
    } else if ((month >= 9 && month <= 11) && (allText.includes('단풍') || allText.includes('가을'))) {
      keywords.add('가을');
    } else if ((month >= 12 || month <= 2) && (allText.includes('눈') || allText.includes('겨울'))) {
      keywords.add('겨울');
    }
    
    // 우선순위 6: 파일명 분석 (의미있는 경우만)
    const filenameKeywords = extractKeywordsFromFilename(imageFile.name);
    if (filenameKeywords.length > 0 && !filenameKeywords.some(k => k.includes('img') || k.includes('photo'))) {
      filenameKeywords.slice(0, 2).forEach(kw => keywords.add(kw));
    }
    
    // 최소 키워드가 너무 적으면 기본값 추가
    if (keywords.size < 3) {
      keywords.add('여행');
      if (location) {
        keywords.add('추억');
      }
    }
    
    // 8. AI 카테고리 자동 분류 ⭐
    const categoryResult = detectCategory(keywords, location, existingNote, colorAnalysis);
    
    // 9. 중복 제거 및 배열 변환 (최대 8개로 제한)
    const finalTags = Array.from(keywords)
      .filter(tag => tag && tag.length >= 2)
      .slice(0, 8);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ AI 분석 완료!');
    console.log('📍 위치:', location || '없음');
    console.log('📝 노트:', existingNote || '없음');
    console.log('🏷️ 추천 태그 (' + finalTags.length + '개):', finalTags);
    console.log('🎯 자동 카테고리:', categoryResult.categoryName);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return {
      success: true,
      tags: finalTags,
      category: categoryResult.category,
      categoryName: categoryResult.categoryName,
      categoryIcon: categoryResult.icon,
      brightness: colorAnalysis.brightness,
      colorAnalysis,
      metadata: exifData
    };
    
  } catch (error) {
    console.error('❌ AI 분석 실패:', error);
    return {
      success: false,
      tags: ['여행', '풍경', '추억'],
      category: 'scenic',
      categoryName: '추천 장소',
      categoryIcon: '🏞️',
      error: error.message
    };
  }
};

// 태그를 해시태그 형식으로 변환
export const formatAsHashtags = (tags) => {
  return tags.map(tag => tag.startsWith('#') ? tag : `#${tag}`);
};

// 추천 태그 가져오기 (카테고리별)
export const getRecommendedTags = (category) => {
  const recommendations = {
    all: ['여행', '풍경', '맛집', '카페', '힐링', '자연', '도시', '바다', '산', '추억'],
    nature: ['자연', '풍경', '산', '바다', '숲', '계곡', '힐링'],
    food: ['맛집', '음식', '카페', '디저트', '커피', '한식', '맛있는'],
    city: ['도시', '야경', '쇼핑', '카페', '문화', '건축'],
    activity: ['여행', '나들이', '등산', '캠핑', '드라이브', '힐링']
  };
  
  return recommendations[category] || recommendations.all;
};

