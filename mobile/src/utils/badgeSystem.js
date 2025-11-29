/**
 * 뱃지 시스템 - 난이도별 뱃지 관리
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  
  '전국 여행가': {
    name: '전국 여행가',
    difficulty: '중',
    icon: '🧳',
    description: '3개 이상의 지역에서 각각 5개 이상의 게시물을 올린 전국 여행가입니다!',
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
  }
};

// 사용자 통계 계산
export const calculateUserStats = async () => {
  try {
    const postsJson = await AsyncStorage.getItem('uploadedPosts');
    const posts = postsJson ? JSON.parse(postsJson) : [];
    
    // 현재 사용자 정보 가져오기
    const userJson = await AsyncStorage.getItem('user');
    const savedUser = userJson ? JSON.parse(userJson) : {};
    const currentUserId = savedUser?.id;
    
    // 현재 사용자의 게시물만 필터링 (뱃지 통계는 본인 게시물만)
    const userPosts = currentUserId 
      ? posts.filter(post => {
          const postUserId = post.userId || 
                            (typeof post.user === 'string' ? post.user : post.user?.id) ||
                            post.user;
          return postUserId === currentUserId;
        })
      : posts; // 사용자 정보가 없으면 모든 게시물 포함
    
    console.log('📊 뱃지 통계 계산:', {
      전체게시물: posts.length,
      사용자게시물: userPosts.length,
      사용자ID: currentUserId
    });
    
    // 지역별 게시물 수
    const regionPosts = {};
    userPosts.forEach(post => {
      const region = post.location?.split(' ')[0] || post.detailedLocation?.split(' ')[0];
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
    const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
    
    // 방문한 지역 수
    const visitedRegions = Object.keys(regionPosts).length;
    
    // 가입일
    const joinDateJson = await AsyncStorage.getItem('userJoinDate');
    const joinDate = joinDateJson || new Date().toISOString();
    if (!joinDateJson) {
      await AsyncStorage.setItem('userJoinDate', joinDate);
    }
    
    // 연속 업로드 일수
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

// 연속 업로드 일수 계산
const calculateConsecutiveDays = (posts) => {
  if (posts.length === 0) return 0;
  
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
export const checkNewBadges = async () => {
  try {
    console.log('🔍 뱃지 체크 시작');
    const stats = await calculateUserStats();
    console.log('📊 현재 통계:', stats);
    
    const earnedBadgesJson = await AsyncStorage.getItem('earnedBadges');
    const earnedBadges = earnedBadgesJson ? JSON.parse(earnedBadgesJson) : [];
    const earnedBadgeNames = earnedBadges.map(b => b.name);
    console.log('🏆 이미 획득한 뱃지:', earnedBadgeNames);
    
    const newBadges = [];
    
    // 기본 뱃지 + 지역별 뱃지 모두 확인
    const allBadges = await getAllBadges();
    
    Object.values(allBadges).forEach(badge => {
      const isEarned = earnedBadgeNames.includes(badge.name);
      const conditionMet = badge.condition(stats);
      
      console.log(`  ${badge.name}: ${isEarned ? '이미 획득' : conditionMet ? '✅ 획득 가능' : '❌ 조건 미달성'} (조건: ${conditionMet})`);
      
      if (!isEarned && conditionMet) {
        newBadges.push(badge);
        console.log(`  🎉 새 뱃지 발견: ${badge.name}`);
      }
    });
    
    console.log(`✅ 총 ${newBadges.length}개의 새 뱃지 발견`);
    return newBadges;
  } catch (error) {
    console.error('❌ 뱃지 체크 오류:', error);
    return [];
  }
};

// 뱃지 획득 처리
export const awardBadge = async (badge) => {
  try {
    console.log(`🎁 뱃지 획득 처리 시작: ${badge.name}`);
    const earnedBadgesJson = await AsyncStorage.getItem('earnedBadges');
    const earnedBadges = earnedBadgesJson ? JSON.parse(earnedBadgesJson) : [];
    
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
    await AsyncStorage.setItem('earnedBadges', JSON.stringify(earnedBadges));
    
    console.log(`✅ 뱃지 저장 완료: ${badge.name} (난이도: ${badge.difficulty})`);
    console.log(`📋 현재 획득한 뱃지 수: ${earnedBadges.length}개`);
    
    return true;
  } catch (error) {
    console.error('❌ 뱃지 획득 실패:', error);
    return false;
  }
};

// 획득한 뱃지 목록
export const getEarnedBadges = async () => {
  try {
    const earnedBadgesJson = await AsyncStorage.getItem('earnedBadges');
    return earnedBadgesJson ? JSON.parse(earnedBadgesJson) : [];
  } catch (error) {
    console.error('뱃지 목록 조회 실패:', error);
    return [];
  }
};

// 특정 사용자의 뱃지 목록 가져오기
export const getEarnedBadgesForUser = async (userId) => {
  try {
    const earnedBadgesJson = await AsyncStorage.getItem(`earnedBadges_${userId}`);
    if (earnedBadgesJson) {
      return JSON.parse(earnedBadgesJson);
    }
    
    // 사용자별 뱃지가 없으면 통계를 계산해서 뱃지 확인
    const stats = await calculateUserStatsForUser(userId);
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
      await AsyncStorage.setItem(`earnedBadges_${userId}`, JSON.stringify(earnedBadges));
    }
    
    return earnedBadges;
  } catch (error) {
    console.error('사용자 뱃지 목록 조회 실패:', error);
    return [];
  }
};

// 특정 사용자의 통계 계산
export const calculateUserStatsForUser = async (userId) => {
  try {
    const postsJson = await AsyncStorage.getItem('uploadedPosts');
    const allPosts = postsJson ? JSON.parse(postsJson) : [];
    
    // 특정 사용자의 게시물만 필터링 (모든 게시물 포함 - 필터링 제거)
    const userPosts = allPosts.filter(post => {
      const postUserId = post.userId || 
                        (typeof post.user === 'string' ? post.user : post.user?.id) ||
                        post.user;
      return postUserId === userId;
    });
    
    // 지역별 게시물 수 (로컬 저장된 지역 정보 사용)
    const regionPosts = {};
    userPosts.forEach(post => {
      // 우선순위: region 필드 > location 첫 단어 > detailedLocation 첫 단어
      let region = post.region;
      if (!region) {
        region = post.location?.split(' ')[0] || post.detailedLocation?.split(' ')[0];
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
    const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
    
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
export const hasSeenBadge = async (badgeName) => {
  try {
    const seenBadgesJson = await AsyncStorage.getItem('seenBadges');
    const seenBadges = seenBadgesJson ? JSON.parse(seenBadgesJson) : [];
    return seenBadges.includes(badgeName);
  } catch (error) {
    return false;
  }
};

// 뱃지를 본 것으로 표시
export const markBadgeAsSeen = async (badgeName) => {
  try {
    const seenBadgesJson = await AsyncStorage.getItem('seenBadges');
    const seenBadges = seenBadgesJson ? JSON.parse(seenBadgesJson) : [];
    if (!seenBadges.includes(badgeName)) {
      seenBadges.push(badgeName);
      await AsyncStorage.setItem('seenBadges', JSON.stringify(seenBadges));
    }
  } catch (error) {
    console.error('뱃지 표시 실패:', error);
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
export const getAvailableBadges = async () => {
  try {
    const stats = await calculateUserStats();
    const earnedBadges = await getEarnedBadges();
    const earnedBadgeNames = earnedBadges.map(b => b.name);
    
    console.log('📊 뱃지 통계:', {
      totalPosts: stats.totalPosts,
      totalLikes: stats.totalLikes,
      visitedRegions: stats.visitedRegions,
      categoryPosts: stats.categoryPosts,
      regionPosts: stats.regionPosts
    });
    
    // 기본 뱃지 + 지역별 뱃지 모두 포함
    const allBadges = await getAllBadges();
    
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
  } catch (error) {
    console.error('뱃지 목록 조회 실패:', error);
    return [];
  }
};

// 지역별 뱃지 생성 및 로컬 저장 함수
export const generateRegionBadges = async () => {
  const mainRegions = ['서울', '부산', '제주', '경주', '강릉', '전주', '여수', '속초', '춘천', '태안', '안동', '통영', '남해', '거제', '포항', '목포', '순천', '익산', '군산', '정선', '평창', '홍천', '횡성', '영월', '단양', '보령', '서천', '부안', '고창', '무주', '장수', '임실', '순창', '완주', '진안', '금산', '논산', '계룡', '공주', '세종', '천안', '아산', '당진', '서산', '홍성', '예산', '청양', '부여', '청주', '충주', '제천', '보은', '옥천', '영동', '증평', '진천', '괴산', '음성', '영주', '영천', '구미', '김천', '문경', '경산', '군위', '의성', '청송', '영양', '영덕', '청도', '고령', '성주', '칠곡', '예천', '봉화', '울진', '울릉', '창원', '마산', '진해', '사천', '김해', '밀양', '양산', '의령', '함안', '창녕', '고성', '하동', '산청', '함양', '거창', '합천', '정읍', '남원', '김제'];
  const regionBadges = {};
  
  // 중복 제거
  const uniqueRegions = [...new Set(mainRegions)];
  
  uniqueRegions.forEach(region => {
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
    await AsyncStorage.setItem('regionBadges', JSON.stringify(regionBadges));
    console.log(`✅ ${Object.keys(regionBadges).length}개의 지역별 뱃지를 로컬에 저장했습니다.`);
  } catch (error) {
    console.error('지역별 뱃지 저장 실패:', error);
  }
  
  return regionBadges;
};

// 로컬에 저장된 지역별 뱃지 가져오기
export const getRegionBadges = async () => {
  try {
    const regionBadgesJson = await AsyncStorage.getItem('regionBadges');
    if (regionBadgesJson) {
      return JSON.parse(regionBadgesJson);
    }
    // 없으면 생성
    return await generateRegionBadges();
  } catch (error) {
    console.error('지역별 뱃지 로드 실패:', error);
    return await generateRegionBadges();
  }
};

// 모든 뱃지 가져오기 (기본 뱃지 + 지역별 뱃지)
export const getAllBadges = async () => {
  const regionBadges = await getRegionBadges();
  return { ...BADGES, ...regionBadges };
};
