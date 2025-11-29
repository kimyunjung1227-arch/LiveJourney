/**
 * 뱃지 시스템 - 난이도별 뱃지 관리
 */

// 뱃지 목록 (난이도 포함)
export const BADGES = {
  // === 시작 뱃지 (하) ===
  '첫 여행 기록': {
    name: '첫 여행 기록',
    difficulty: '하',
    icon: '🎯',
    description: '첫 번째 여행 사진을 업로드했습니다!',
    condition: (stats) => stats.totalPosts >= 1,
    target: 1,
    getProgress: (stats) => Math.min(100, (stats.totalPosts / 1) * 100)
  },
  
  '여행 입문자': {
    name: '여행 입문자',
    difficulty: '하',
    icon: '🌱',
    description: '3개의 여행 기록을 남겼습니다.',
    condition: (stats) => stats.totalPosts >= 3,
    target: 3,
    getProgress: (stats) => Math.min(100, (stats.totalPosts / 3) * 100)
  },
  
  '첫 좋아요': {
    name: '첫 좋아요',
    difficulty: '하',
    icon: '💝',
    description: '첫 번째 좋아요를 받았습니다!',
    condition: (stats) => stats.totalLikes >= 1,
    target: 1,
    getProgress: (stats) => Math.min(100, (stats.totalLikes / 1) * 100)
  },
  
  // === 활동 뱃지 (중) ===
  '여행 탐험가': {
    name: '여행 탐험가',
    difficulty: '중',
    icon: '🧳',
    description: '10개의 여행 기록을 남긴 진정한 탐험가!',
    condition: (stats) => stats.totalPosts >= 10,
    target: 10,
    getProgress: (stats) => Math.min(100, (stats.totalPosts / 10) * 100)
  },
  
  '사진 수집가': {
    name: '사진 수집가',
    difficulty: '중',
    icon: '📷',
    description: '25개의 여행 사진을 업로드했습니다.',
    condition: (stats) => stats.totalPosts >= 25,
    target: 25,
    getProgress: (stats) => Math.min(100, (stats.totalPosts / 25) * 100)
  },
  
  '인기 여행자': {
    name: '인기 여행자',
    difficulty: '중',
    icon: '✨',
    description: '50개의 좋아요를 받았습니다!',
    condition: (stats) => stats.totalLikes >= 50,
    target: 50,
    getProgress: (stats) => Math.min(100, (stats.totalLikes / 50) * 100)
  },
  
  '지역 전문가': {
    name: '지역 전문가',
    difficulty: '중',
    icon: '🗺️',
    description: '5개 이상의 지역을 방문했습니다.',
    condition: (stats) => stats.visitedRegions >= 5,
    target: 5,
    getProgress: (stats) => Math.min(100, (stats.visitedRegions / 5) * 100)
  },
  
  // === 전문가 뱃지 (상) ===
  '여행 마스터': {
    name: '여행 마스터',
    difficulty: '상',
    icon: '🏆',
    description: '50개의 여행 기록을 남긴 마스터!',
    condition: (stats) => stats.totalPosts >= 50,
    target: 50,
    getProgress: (stats) => Math.min(100, (stats.totalPosts / 50) * 100)
  },
  
  '전국 정복자': {
    name: '전국 정복자',
    difficulty: '상',
    icon: '🌍',
    description: '10개 이상의 지역을 모두 방문했습니다!',
    condition: (stats) => stats.visitedRegions >= 10,
    target: 10,
    getProgress: (stats) => Math.min(100, (stats.visitedRegions / 10) * 100)
  },
  
  '슈퍼스타': {
    name: '슈퍼스타',
    difficulty: '상',
    icon: '🌟',
    description: '100개 이상의 좋아요를 받은 슈퍼스타!',
    condition: (stats) => stats.totalLikes >= 100,
    target: 100,
    getProgress: (stats) => Math.min(100, (stats.totalLikes / 100) * 100)
  },
  
  '여행 레전드': {
    name: '여행 레전드',
    difficulty: '상',
    icon: '👑',
    description: '100개의 여행 기록을 남긴 전설!',
    condition: (stats) => stats.totalPosts >= 100,
    target: 100,
    getProgress: (stats) => Math.min(100, (stats.totalPosts / 100) * 100)
  },
  
  // === 지역 활동 뱃지 ===
  '지역 팬': {
    name: '지역 팬',
    difficulty: '하',
    icon: '💚',
    description: '한 지역에서 3개 이상의 게시물을 올린 진정한 지역 팬입니다!',
    condition: (stats) => {
      const regionValues = Object.values(stats.regionPosts || {});
      if (regionValues.length === 0) return false;
      const maxRegionPosts = Math.max(...regionValues, 0);
      return maxRegionPosts >= 3;
    },
    target: 3,
    getProgress: (stats) => {
      const regionValues = Object.values(stats.regionPosts || {});
      if (regionValues.length === 0) return 0;
      const maxRegionPosts = Math.max(...regionValues, 0);
      return Math.min(100, (maxRegionPosts / 3) * 100);
    }
  },
  
  '지역 스카우터': {
    name: '지역 스카우터',
    difficulty: '하',
    icon: '🔍',
    description: '한 지역에서 5개 이상의 게시물을 올린 지역 명소 발굴가입니다!',
    condition: (stats) => {
      const regionValues = Object.values(stats.regionPosts || {});
      if (regionValues.length === 0) return false;
      const maxRegionPosts = Math.max(...regionValues, 0);
      return maxRegionPosts >= 5;
    },
    target: 5,
    getProgress: (stats) => {
      const regionValues = Object.values(stats.regionPosts || {});
      if (regionValues.length === 0) return 0;
      const maxRegionPosts = Math.max(...regionValues, 0);
      return Math.min(100, (maxRegionPosts / 5) * 100);
    }
  },
  
  '지역 홍보대사': {
    name: '지역 홍보대사',
    difficulty: '중',
    icon: '📢',
    description: '한 지역에서 10개 이상의 게시물을 올린 지역 홍보대사입니다!',
    condition: (stats) => {
      // 가장 많이 게시물을 올린 지역이 10개 이상인지 확인
      const regionValues = Object.values(stats.regionPosts || {});
      if (regionValues.length === 0) return false;
      const maxRegionPosts = Math.max(...regionValues, 0);
      return maxRegionPosts >= 10;
    },
    target: 10,
    getProgress: (stats) => {
      const regionValues = Object.values(stats.regionPosts || {});
      if (regionValues.length === 0) return 0;
      const maxRegionPosts = Math.max(...regionValues, 0);
      return Math.min(100, (maxRegionPosts / 10) * 100);
    }
  },
  
  '지역 인플루언서': {
    name: '지역 인플루언서',
    difficulty: '중',
    icon: '📸',
    description: '한 지역에서 15개 이상의 사진을 올린 지역 인플루언서입니다!',
    condition: (stats) => {
      const regionValues = Object.values(stats.regionPosts || {});
      if (regionValues.length === 0) return false;
      const maxRegionPosts = Math.max(...regionValues, 0);
      return maxRegionPosts >= 15;
    },
    target: 15,
    getProgress: (stats) => {
      const regionValues = Object.values(stats.regionPosts || {});
      if (regionValues.length === 0) return 0;
      const maxRegionPosts = Math.max(...regionValues, 0);
      return Math.min(100, (maxRegionPosts / 15) * 100);
    }
  },
  
  '지역 가이드': {
    name: '지역 가이드',
    difficulty: '중',
    icon: '🧳',
    description: '3개 이상의 지역에서 각각 5개 이상의 게시물을 올린 지역 가이드입니다!',
    condition: (stats) => {
      const regionsWith5Posts = Object.values(stats.regionPosts || {}).filter(count => count >= 5).length;
      return regionsWith5Posts >= 3;
    },
    target: 3,
    getProgress: (stats) => {
      const regionsWith5Posts = Object.values(stats.regionPosts || {}).filter(count => count >= 5).length;
      return Math.min(100, (regionsWith5Posts / 3) * 100);
    }
  },
  
  '지역 명예시민': {
    name: '지역 명예시민',
    difficulty: '상',
    icon: '👑',
    description: '한 지역에서 20개 이상의 게시물을 올린 지역 명예시민입니다!',
    condition: (stats) => {
      const regionValues = Object.values(stats.regionPosts || {});
      if (regionValues.length === 0) return false;
      const maxRegionPosts = Math.max(...regionValues, 0);
      return maxRegionPosts >= 20;
    },
    target: 20,
    getProgress: (stats) => {
      const regionValues = Object.values(stats.regionPosts || {});
      if (regionValues.length === 0) return 0;
      const maxRegionPosts = Math.max(...regionValues, 0);
      return Math.min(100, (maxRegionPosts / 20) * 100);
    }
  },
  
  // === 카테고리별 뱃지 (중) ===
  '맛집 헌터': {
    name: '맛집 헌터',
    difficulty: '중',
    icon: '🍽️',
    description: '10개 이상의 맛집을 소개했습니다!',
    condition: (stats) => (stats.categoryPosts['food'] || 0) >= 10,
    target: 10,
    getProgress: (stats) => Math.min(100, ((stats.categoryPosts['food'] || 0) / 10) * 100)
  },
  
  '꽃 사냥꾼': {
    name: '꽃 사냥꾼',
    difficulty: '중',
    icon: '🌺',
    description: '10개 이상의 개화 상황을 공유했습니다!',
    condition: (stats) => (stats.categoryPosts['bloom'] || 0) >= 10,
    target: 10,
    getProgress: (stats) => Math.min(100, ((stats.categoryPosts['bloom'] || 0) / 10) * 100)
  },
  
  '명소 추천왕': {
    name: '명소 추천왕',
    difficulty: '중',
    icon: '🏔️',
    description: '15개 이상의 추천 장소를 공유했습니다!',
    condition: (stats) => (stats.categoryPosts['scenic'] || 0) >= 15,
    target: 15,
    getProgress: (stats) => Math.min(100, ((stats.categoryPosts['scenic'] || 0) / 15) * 100)
  },
  
  // === 특별 뱃지 (상) ===
  '얼리어답터': {
    name: '얼리어답터',
    difficulty: '상',
    icon: '🚀',
    description: '가입 후 7일 이내에 10개 이상의 사진을 업로드한 활발한 멤버입니다!',
    condition: (stats) => {
      if (!stats.joinDate) return false;
      const joinDate = new Date(stats.joinDate);
      const now = new Date();
      const daysSinceJoin = (now - joinDate) / (1000 * 60 * 60 * 24);
      
      // 가입 후 7일 이내이고, 10개 이상 게시물 업로드
      return daysSinceJoin <= 7 && stats.totalPosts >= 10;
    },
    target: 10,
    getProgress: (stats) => {
      if (!stats.joinDate) return 0;
      const joinDate = new Date(stats.joinDate);
      const now = new Date();
      const daysSinceJoin = (now - joinDate) / (1000 * 60 * 60 * 24);
      
      // 7일이 지났으면 0% 또는 100% (조건 만족 여부)
      if (daysSinceJoin > 7) {
        return stats.totalPosts >= 10 ? 100 : 0;
      }
      
      // 7일 이내: 게시물 수 기준으로 진행률 계산
      return Math.min(100, (stats.totalPosts / 10) * 100);
    }
  },
  
  '연속 업로더': {
    name: '연속 업로더',
    difficulty: '상',
    icon: '🔥',
    description: '7일 연속으로 사진을 업로드했습니다!',
    condition: (stats) => stats.consecutiveDays >= 7,
    target: 7,
    getProgress: (stats) => Math.min(100, (stats.consecutiveDays / 7) * 100)
  }
};

// 지역명 정규화 함수 (같은 지역을 정확하게 판단하기 위해)
const normalizeRegionName = (regionName) => {
  if (!regionName) return null;
  
  // 문자열로 변환
  let normalized = String(regionName).trim();
  
  // 특별시/광역시/특별자치시/특별자치도 제거
  normalized = normalized
    .replace(/특별시/g, '')
    .replace(/광역시/g, '')
    .replace(/특별자치시/g, '')
    .replace(/특별자치도/g, '')
    .trim();
  
  // 공백으로 분리된 첫 번째 단어만 사용 (예: "서울 강남구" -> "서울")
  const firstWord = normalized.split(/\s+/)[0];
  
  // 주요 지역명 매핑
  const regionMap = {
    '서울': '서울',
    '부산': '부산',
    '대구': '대구',
    '인천': '인천',
    '광주': '광주',
    '대전': '대전',
    '울산': '울산',
    '세종': '세종',
    '경기': '경기',
    '강원': '강원',
    '충북': '충북',
    '충남': '충남',
    '전북': '전북',
    '전남': '전남',
    '경북': '경북',
    '경남': '경남',
    '제주': '제주',
    '제주도': '제주',
    '경주': '경주',
    '강릉': '강릉',
    '전주': '전주',
    '여수': '여수',
    '속초': '속초',
    '춘천': '춘천',
    '태안': '태안',
    '안동': '안동',
    '통영': '통영',
    '남해': '남해',
    '거제': '거제',
    '포항': '포항',
    '목포': '목포',
    '순천': '순천',
    '익산': '익산',
    '군산': '군산',
    '정선': '정선',
    '평창': '평창',
    '홍천': '홍천',
    '횡성': '횡성',
    '영월': '영월',
    '단양': '단양',
    '보령': '보령',
    '서천': '서천',
    '부안': '부안',
    '고창': '고창',
    '무주': '무주',
    '장수': '장수',
    '임실': '임실',
    '순창': '순창',
    '완주': '완주',
    '진안': '진안',
    '금산': '금산',
    '논산': '논산',
    '계룡': '계룡',
    '공주': '공주',
    '천안': '천안',
    '아산': '아산',
    '당진': '당진',
    '서산': '서산',
    '홍성': '홍성',
    '예산': '예산',
    '청양': '청양',
    '부여': '부여',
    '청주': '청주',
    '충주': '충주',
    '제천': '제천',
    '보은': '보은',
    '옥천': '옥천',
    '영동': '영동',
    '증평': '증평',
    '진천': '진천',
    '괴산': '괴산',
    '음성': '음성',
    '영주': '영주',
    '영천': '영천',
    '구미': '구미',
    '김천': '김천',
    '문경': '문경',
    '경산': '경산',
    '군위': '군위',
    '의성': '의성',
    '청송': '청송',
    '영양': '영양',
    '영덕': '영덕',
    '청도': '청도',
    '고령': '고령',
    '성주': '성주',
    '칠곡': '칠곡',
    '예천': '예천',
    '봉화': '봉화',
    '울진': '울진',
    '울릉': '울릉',
    '창원': '창원',
    '마산': '마산',
    '진해': '진해',
    '사천': '사천',
    '김해': '김해',
    '밀양': '밀양',
    '양산': '양산',
    '의령': '의령',
    '함안': '함안',
    '창녕': '창녕',
    '고성': '고성',
    '하동': '하동',
    '산청': '산청',
    '함양': '함양',
    '거창': '거창',
    '합천': '합천',
    '정읍': '정읍',
    '남원': '남원',
    '김제': '김제'
  };
  
  // 매핑된 지역명이 있으면 사용, 없으면 첫 단어 사용
  return regionMap[firstWord] || firstWord;
};

// 사용자 통계 계산
export const calculateUserStats = () => {
  const posts = JSON.parse(localStorage.getItem('uploadedPosts') || '[]');
  
  // 현재 사용자 정보 가져오기
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = savedUser?.id;
  
  // 현재 사용자의 게시물만 필터링 (뱃지 통계는 본인 게시물만)
  // userId가 없거나 일치하지 않으면 모든 게시물을 현재 사용자 게시물로 간주
  let userPosts = posts;
  
  if (currentUserId) {
    userPosts = posts.filter(post => {
      const postUserId = post.userId || 
                        (typeof post.user === 'string' ? post.user : post.user?.id) ||
                        post.user;
      
      // userId가 없으면 현재 사용자 게시물로 간주
      if (!postUserId) {
        return true;
      }
      
      // userId가 일치하거나 둘 다 test_user_001이면 포함
      return postUserId === currentUserId || 
             postUserId === 'test_user_001' || 
             currentUserId === 'test_user_001';
    });
  }
  
  // 사용자 정보가 없으면 모든 게시물을 현재 사용자 게시물로 간주
  
  console.log('📊 뱃지 통계 계산:', {
    전체게시물: posts.length,
    사용자게시물: userPosts.length,
    사용자ID: currentUserId,
    사용자게시물샘플: userPosts.slice(0, 3).map(p => ({
      id: p.id,
      userId: p.userId,
      user: p.user,
      category: p.category,
      categoryName: p.categoryName,
      location: p.location,
      detailedLocation: p.detailedLocation
    })),
    totalPosts: userPosts.length
  });
  
  // 지역별 게시물 수 (위치 정보를 기반으로 정규화된 지역명 사용)
  const regionPosts = {};
  userPosts.forEach(post => {
    // 우선순위: region 필드 > location > detailedLocation > address
    let region = post.region;
    
    if (!region) {
      // location, detailedLocation, address 중 하나에서 지역 추출
      const locationStr = post.location || post.detailedLocation || post.address || '';
      region = normalizeRegionName(locationStr);
    } else {
      // region 필드가 있어도 정규화
      region = normalizeRegionName(region);
    }
    
    if (region) {
      regionPosts[region] = (regionPosts[region] || 0) + 1;
    }
  });
  
  console.log('📊 지역별 게시물 수 (정규화 후):', regionPosts);
  
  // 지역별 통계를 로컬에 저장 (뱃지 시스템용)
  try {
    localStorage.setItem('regionStats', JSON.stringify(regionPosts));
  } catch (error) {
    console.error('지역 통계 저장 실패:', error);
  }
  
  // 카테고리별 게시물 수 (category 필드 사용)
  const categoryPosts = {};
  userPosts.forEach(post => {
    // category 필드 또는 categoryName으로부터 category 추출
    let category = post.category;
    
    // category가 없으면 categoryName에서 추출
    if (!category && post.categoryName) {
      if (post.categoryName === '개화 상황') {
        category = 'bloom';
      } else if (post.categoryName === '맛집 정보') {
        category = 'food';
      } else {
        category = 'scenic';
      }
    }
    
    if (category) {
      categoryPosts[category] = (categoryPosts[category] || 0) + 1;
    }
  });
  
  console.log('📊 카테고리별 게시물 수:', categoryPosts);
  
  // 총 좋아요 수
  const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
  
  // 방문한 지역 수
  const visitedRegions = Object.keys(regionPosts).length;
  
  // 가입일 (localStorage에서 가져오기, 없으면 현재)
  const joinDate = localStorage.getItem('userJoinDate') || new Date().toISOString();
  if (!localStorage.getItem('userJoinDate')) {
    localStorage.setItem('userJoinDate', joinDate);
  }
  
  // 연속 업로드 일수 (간단히 구현)
  const consecutiveDays = calculateConsecutiveDays(userPosts);
  
  return {
    totalPosts: userPosts.length,
    totalLikes,
    visitedRegions,
    regionPosts,
    categoryPosts,
    joinDate,
    consecutiveDays
  };
};

// 연속 업로드 일수 계산
const calculateConsecutiveDays = (posts) => {
  if (posts.length === 0) return 0;
  
  // 날짜별로 게시물 그룹화
  const dateSet = new Set();
  posts.forEach(post => {
    if (post.timestamp || post.time) {
      const date = new Date(post.timestamp || post.time).toDateString();
      dateSet.add(date);
    }
  });
  
  const dates = Array.from(dateSet).sort((a, b) => new Date(b) - new Date(a));
  
  let consecutive = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const current = new Date(dates[i]);
    const next = new Date(dates[i + 1]);
    const diffDays = Math.floor((current - next) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      consecutive++;
    } else {
      break;
    }
  }
  
  return consecutive;
};

// 새로 획득한 뱃지 확인
export const checkNewBadges = () => {
  console.log('🔍 뱃지 체크 시작');
  const stats = calculateUserStats();
  console.log('📊 현재 통계:', stats);
  
  const earnedBadges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
  const earnedBadgeNames = earnedBadges.map(b => b.name);
  console.log('🏆 이미 획득한 뱃지:', earnedBadgeNames);
  
  const newBadges = [];
  
  // 기본 뱃지 + 지역별 뱃지 모두 확인
  const allBadges = getAllBadges();
  
  Object.values(allBadges).forEach(badge => {
    const isEarned = earnedBadgeNames.includes(badge.name);
    let conditionMet = false;
    
    try {
      conditionMet = badge.condition(stats);
    } catch (error) {
      console.error(`❌ 뱃지 조건 체크 오류 (${badge.name}):`, error);
      conditionMet = false;
    }
    
    // 상세 로그 - 획득 가능하거나 이미 획득한 뱃지만 로그 출력
    if (isEarned || conditionMet) {
      const progress = badge.getProgress ? badge.getProgress(stats) : 0;
      console.log(`  ${badge.name}: ${isEarned ? '이미 획득' : '✅ 획득 가능'} (조건: ${conditionMet}, 진행률: ${progress.toFixed(1)}%)`);
    }
    
    if (!isEarned && conditionMet) {
      newBadges.push(badge);
      console.log(`  🎉 새 뱃지 발견: ${badge.name}`);
    }
  });
  
  console.log(`✅ 총 ${newBadges.length}개의 새 뱃지 발견`);
  return newBadges;
};

// 뱃지 획득 처리
export const awardBadge = (badge) => {
  console.log(`🎁 뱃지 획득 처리 시작: ${badge.name}`);
  
  try {
    const earnedBadges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
    
    // 이미 획득한 뱃지인지 확인
    if (earnedBadges.some(b => b.name === badge.name)) {
      console.log(`⚠️ 이미 획득한 뱃지: ${badge.name}`);
      return false;
    }
    
    // 뱃지 추가
    const newBadge = {
      ...badge,
      earnedAt: new Date().toISOString()
    };
    
    earnedBadges.push(newBadge);
    
    // localStorage 저장 시도
    try {
      localStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));
      console.log(`✅ 뱃지 저장 완료: ${badge.name} (난이도: ${badge.difficulty})`);
      console.log(`📋 현재 획득한 뱃지 수: ${earnedBadges.length}개`);
      
      // 저장 확인
      const verify = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
      if (verify.some(b => b.name === badge.name)) {
        console.log(`✅ 뱃지 저장 확인됨: ${badge.name}`);
      } else {
        console.error(`❌ 뱃지 저장 실패: ${badge.name}`);
        return false;
      }
    } catch (saveError) {
      console.error(`❌ localStorage 저장 오류:`, saveError);
      return false;
    }
    
    // 뱃지 획득 이벤트 발생
    window.dispatchEvent(new CustomEvent('badgeEarned', { detail: newBadge }));
    window.dispatchEvent(new Event('badgeProgressUpdated'));
    
    return true;
  } catch (error) {
    console.error(`❌ 뱃지 획득 처리 오류:`, error);
    return false;
  }
};

// 획득한 뱃지 목록
export const getEarnedBadges = () => {
  return JSON.parse(localStorage.getItem('earnedBadges') || '[]');
};

// 특정 사용자의 뱃지 목록 가져오기
export const getEarnedBadgesForUser = (userId) => {
  try {
    const earnedBadgesJson = localStorage.getItem(`earnedBadges_${userId}`);
    if (earnedBadgesJson) {
      return JSON.parse(earnedBadgesJson);
    }
    
    // 사용자별 뱃지가 없으면 통계를 계산해서 뱃지 확인
    const stats = calculateUserStatsForUser(userId);
    const earnedBadges = [];
    
    Object.values(BADGES).forEach(badge => {
      if (badge.condition(stats)) {
        earnedBadges.push({
          ...badge,
          earnedAt: new Date().toISOString()
        });
      }
    });
    
    // 계산된 뱃지 저장
    if (earnedBadges.length > 0) {
      localStorage.setItem(`earnedBadges_${userId}`, JSON.stringify(earnedBadges));
    }
    
    return earnedBadges;
  } catch (error) {
    console.error('사용자 뱃지 목록 조회 실패:', error);
    return [];
  }
};

// 특정 사용자의 통계 계산
export const calculateUserStatsForUser = (userId) => {
  try {
    const allPosts = JSON.parse(localStorage.getItem('uploadedPosts') || '[]');
    
    // 특정 사용자의 게시물만 필터링 (모든 게시물 포함 - 필터링 제거)
    const userPosts = allPosts.filter(post => {
      const postUserId = post.userId || 
                        (typeof post.user === 'string' ? post.user : post.user?.id) ||
                        post.user;
      return postUserId === userId;
    });
    
    // 지역별 게시물 수 (위치 정보를 기반으로 정규화된 지역명 사용)
    const regionPosts = {};
    userPosts.forEach(post => {
      // 우선순위: region 필드 > location > detailedLocation > address
      let region = post.region;
      
      if (!region) {
        // location, detailedLocation, address 중 하나에서 지역 추출
        const locationStr = post.location || post.detailedLocation || post.address || '';
        region = normalizeRegionName(locationStr);
      } else {
        // region 필드가 있어도 정규화
        region = normalizeRegionName(region);
      }
      
      if (region) {
        regionPosts[region] = (regionPosts[region] || 0) + 1;
      }
    });
    
    // 카테고리별 게시물 수
    const categoryPosts = {};
    userPosts.forEach(post => {
      const category = post.category;
      if (category) {
        categoryPosts[category] = (categoryPosts[category] || 0) + 1;
      }
    });
    
    // 총 좋아요 수
    const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || post.likeCount || 0), 0);
    
    // 방문한 지역 수
    const visitedRegions = Object.keys(regionPosts).length;
    
    // 연속 업로드 일수
    const consecutiveDays = calculateConsecutiveDays(userPosts);
    
    return {
      totalPosts: userPosts.length,
      totalLikes,
      visitedRegions,
      regionPosts,
      categoryPosts,
      joinDate: new Date().toISOString(), // 기본값
      consecutiveDays
    };
  } catch (error) {
    console.error('사용자 통계 계산 실패:', error);
    return {
      totalPosts: 0,
      totalLikes: 0,
      visitedRegions: 0,
      regionPosts: {},
      categoryPosts: {},
      joinDate: new Date().toISOString(),
      consecutiveDays: 0
    };
  }
};

// 뱃지 획득 여부 확인
export const hasSeenBadge = (badgeName) => {
  const seenBadges = JSON.parse(localStorage.getItem('seenBadges') || '[]');
  return seenBadges.includes(badgeName);
};

// 뱃지를 본 것으로 표시
export const markBadgeAsSeen = (badgeName) => {
  const seenBadges = JSON.parse(localStorage.getItem('seenBadges') || '[]');
  if (!seenBadges.includes(badgeName)) {
    seenBadges.push(badgeName);
    localStorage.setItem('seenBadges', JSON.stringify(seenBadges));
  }
};

// 뱃지 조건 타입 추출 (동일 조건 그룹화를 위해)
const getBadgeConditionType = (badge) => {
  // condition이 없으면 unknown 반환
  if (!badge || !badge.condition || typeof badge.condition !== 'function') {
    return { type: 'unknown', value: badge?.target || 0 };
  }
  
  // condition 함수를 문자열로 변환하여 분석
  const conditionStr = badge.condition.toString();
  
  // totalPosts 관련 조건
  if (conditionStr.includes('totalPosts')) {
    return { type: 'totalPosts', value: badge.target };
  }
  
  // totalLikes 관련 조건
  if (conditionStr.includes('totalLikes')) {
    return { type: 'totalLikes', value: badge.target };
  }
  
  // visitedRegions 관련 조건
  if (conditionStr.includes('visitedRegions')) {
    return { type: 'visitedRegions', value: badge.target };
  }
  
  // regionPosts 관련 조건
  if (conditionStr.includes('regionPosts')) {
    const regionMatch = conditionStr.match(/regionPosts\[['"](.+?)['"]\]/);
    if (regionMatch) {
      return { type: 'regionPosts', region: regionMatch[1], value: badge.target };
    }
  }
  
  // categoryPosts 관련 조건
  if (conditionStr.includes('categoryPosts')) {
    const categoryMatch = conditionStr.match(/categoryPosts\[['"](.+?)['"]\]/);
    if (categoryMatch) {
      return { type: 'categoryPosts', category: categoryMatch[1], value: badge.target };
    }
  }
  
  // consecutiveDays 관련 조건
  if (conditionStr.includes('consecutiveDays')) {
    return { type: 'consecutiveDays', value: badge.target };
  }
  
  // joinDate 관련 조건
  if (conditionStr.includes('joinDate')) {
    return { type: 'joinDate', value: badge.target };
  }
  
  return { type: 'unknown', value: badge.target };
};

// 획득 가능한 뱃지 목록 (진행률 포함)
export const getAvailableBadges = () => {
  const stats = calculateUserStats();
  const earnedBadges = getEarnedBadges();
  const earnedBadgeNames = earnedBadges.map(b => b.name);
  
  console.log('📊 뱃지 통계:', {
    totalPosts: stats.totalPosts,
    totalLikes: stats.totalLikes,
    visitedRegions: stats.visitedRegions,
    categoryPosts: stats.categoryPosts,
    regionPosts: stats.regionPosts
  });
  
  // 기본 뱃지 + 지역별 뱃지 모두 포함
  const allBadges = getAllBadges();
  
  // 모든 뱃지에 대해 조건 타입 추출 (유효한 뱃지만)
  const badgesWithConditionType = Object.values(allBadges)
    .filter(badge => badge && badge.condition && typeof badge.condition === 'function')
    .map(badge => ({
      ...badge,
      conditionType: getBadgeConditionType(badge)
    }));
  
  // 동일 조건을 가진 뱃지들을 그룹화
  const conditionGroups = {};
  badgesWithConditionType.forEach(badge => {
    const key = JSON.stringify(badge.conditionType);
    if (!conditionGroups[key]) {
      conditionGroups[key] = [];
    }
    conditionGroups[key].push(badge);
  });
  
  // 각 뱃지의 진행률 계산 (동일 조건 그룹 내에서도 개별적으로 계산)
  const badgesWithProgress = badgesWithConditionType.map(badge => {
    const isEarned = earnedBadgeNames.includes(badge.name);
    // getProgress 함수를 사용하여 진행률 계산 (이미 동일 조건에 대해 올바르게 계산됨)
    const progress = badge.getProgress ? badge.getProgress(stats) : 0;
    
    const earnedBadge = earnedBadges.find(b => b.name === badge.name);
    
    const result = {
      ...badge,
      isEarned,
      progress: Math.round(progress),
      earnedAt: earnedBadge?.earnedAt,
      conditionType: badge.conditionType
    };
    
    // 디버깅: 진행률이 0이 아닌 뱃지 로그
    if (result.progress > 0 && !result.isEarned) {
      console.log(`🏆 ${badge.name}: ${result.progress}% (목표: ${badge.target})`);
    }
    
    return result;
  });
  
  return badgesWithProgress;
};

// 지역별 뱃지 생성 및 로컬 저장 함수
export const generateRegionBadges = () => {
  // 실제 게시물이 있는 지역만 확인
  const posts = JSON.parse(localStorage.getItem('uploadedPosts') || '[]');
  const stats = calculateUserStats();
  const actualRegions = Object.keys(stats.regionPosts || {});
  
  // 게시물이 있는 지역만 뱃지 생성 (경북 제외)
  const regionBadges = {};
  
  actualRegions
    .filter(region => region !== '경북') // 경북 지역 제외
    .forEach(region => {
    // 지역별 뱃지 생성 (5개, 10개, 20개 단계)
    regionBadges[`${region} 스카우터`] = {
      name: `${region} 스카우터`,
      difficulty: '하',
      icon: '🔍',
      description: `${region} 지역에 5개 이상의 게시물을 올린 ${region} 명소 발굴가입니다!`,
      condition: (stats) => (stats.regionPosts[region] || 0) >= 5,
      target: 5,
      getProgress: (stats) => Math.min(100, ((stats.regionPosts[region] || 0) / 5) * 100),
      region: region
    };
    
    regionBadges[`${region} 홍보대사`] = {
      name: `${region} 홍보대사`,
      difficulty: '중',
      icon: '📢',
      description: `${region} 지역에 10개 이상의 게시물을 올린 ${region} 홍보대사입니다!`,
      condition: (stats) => (stats.regionPosts[region] || 0) >= 10,
      target: 10,
      getProgress: (stats) => Math.min(100, ((stats.regionPosts[region] || 0) / 10) * 100),
      region: region
    };
    
    regionBadges[`${region} 명예시민`] = {
      name: `${region} 명예시민`,
      difficulty: '상',
      icon: '👑',
      description: `${region} 지역에 20개 이상의 게시물을 올린 ${region} 명예시민입니다!`,
      condition: (stats) => (stats.regionPosts[region] || 0) >= 20,
      target: 20,
      getProgress: (stats) => Math.min(100, ((stats.regionPosts[region] || 0) / 20) * 100),
      region: region
    };
  });
  
  // 로컬에 저장
  try {
    localStorage.setItem('regionBadges', JSON.stringify(regionBadges));
    if (Object.keys(regionBadges).length > 0) {
      console.log(`✅ ${Object.keys(regionBadges).length}개의 지역별 뱃지를 로컬에 저장했습니다.`);
    }
  } catch (error) {
    console.error('지역별 뱃지 저장 실패:', error);
  }
  
  return regionBadges;
};

// 로컬에 저장된 지역별 뱃지 가져오기
export const getRegionBadges = () => {
  try {
    // 항상 최신 통계를 기반으로 지역별 뱃지 재생성
    // (게시물이 추가되면 새로운 지역 뱃지가 생성되어야 함)
    return generateRegionBadges();
  } catch (error) {
    console.error('지역별 뱃지 로드 실패:', error);
    return {};
  }
};

// 모든 뱃지 가져오기 (기본 뱃지 + 지역별 뱃지)
export const getAllBadges = () => {
  const regionBadges = getRegionBadges();
  return { ...BADGES, ...regionBadges };
};
