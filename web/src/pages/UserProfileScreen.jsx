import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { getEarnedBadgesForUser, BADGES } from '../utils/badgeSystem';

const UserProfileScreen = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [representativeBadge, setRepresentativeBadge] = useState(null);
  const [stats, setStats] = useState({
    posts: 0,
    likes: 0,
    comments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAllBadges, setShowAllBadges] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate(-1);
      return;
    }

    // 해당 사용자의 정보 찾기 (게시물에서)
    const uploadedPosts = JSON.parse(localStorage.getItem('uploadedPosts') || '[]');
    
    // userId 매칭 (여러 형태 지원)
    const userPost = uploadedPosts.find(p => {
      const postUserId = p.userId || 
                        (typeof p.user === 'string' ? p.user : p.user?.id) ||
                        p.user;
      return postUserId === userId;
    });
    
    if (userPost) {
      const postUserId = userPost.userId || 
                        (typeof userPost.user === 'string' ? userPost.user : userPost.user?.id) ||
                        userPost.user;
      const foundUser = {
        id: userId,
        username: (typeof userPost.user === 'string' ? userPost.user : userPost.user?.username) || 
                 postUserId || 
                 '사용자',
        profileImage: null
      };
      setUser(foundUser);
    } else {
      // 사용자 정보를 찾을 수 없으면 기본값
      setUser({
        id: userId,
        username: '사용자',
        profileImage: null
      });
    }

    // 뱃지 로드
    let badges = getEarnedBadgesForUser(userId);
    
    // 개발 단계: 획득한 뱃지가 없으면 임의로 몇 개 추가
    if (!badges || badges.length === 0) {
      const allBadges = [
        { name: '첫 여행 기록', icon: '🎯', description: '첫 번째 여행 사진을 업로드했습니다!' },
        { name: '여행 입문자', icon: '🌱', description: '3개의 여행 기록을 남겼습니다.' },
        { name: '첫 좋아요', icon: '❤️', description: '첫 번째 좋아요를 받았습니다!' },
        { name: '여행 탐험가', icon: '🧭', description: '10개의 여행 기록을 남긴 진정한 탐험가!' },
        { name: '사진 수집가', icon: '📸', description: '25개의 여행 사진을 업로드했습니다.' },
        { name: '인기 여행자', icon: '⭐', description: '50개의 좋아요를 받았습니다!' },
        { name: '지역 전문가', icon: '🗺️', description: '5개 이상의 지역을 방문했습니다.' },
        { name: '댓글 마스터', icon: '💬', description: '10개의 댓글을 작성했습니다.' },
        { name: '여행 애호가', icon: '✈️', description: '다양한 여행지를 방문했습니다.' },
      ];
      // userId를 기반으로 일관된 뱃지 선택 (3-7개)
      const badgeCount = 3 + (userId ? userId.toString().charCodeAt(0) % 5 : 0);
      badges = allBadges.slice(0, badgeCount);
    }
    setEarnedBadges(badges);
    
    // 대표 뱃지 로드
    const repBadgeJson = localStorage.getItem(`representativeBadge_${userId}`);
    if (repBadgeJson) {
      const repBadge = JSON.parse(repBadgeJson);
      setRepresentativeBadge(repBadge);
    } else if (badges && badges.length > 0) {
      // 대표 뱃지가 없으면 "획득한 뱃지들(badges)" 중에서 대표 뱃지를 선택
      // userId 기반 해시로 일관된 인덱스 선택
      let badgeIndex = 0;
      if (userId) {
        const hash = userId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        badgeIndex = hash % badges.length;
      }
      const repFromEarned = badges[badgeIndex];
      localStorage.setItem(`representativeBadge_${userId}`, JSON.stringify(repFromEarned));
      setRepresentativeBadge(repFromEarned);
    }

    // 해당 사용자의 게시물 로드 (여러 형태 지원)
    const posts = uploadedPosts.filter(post => {
      const postUserId = post.userId || 
                        (typeof post.user === 'string' ? post.user : post.user?.id) ||
                        post.user;
      return postUserId === userId;
    });
    setUserPosts(posts);
    
    // 통계 계산
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || post.likeCount || 0), 0);
    const totalComments = posts.reduce((sum, post) => {
      const comments = post.comments || [];
      const qnaList = post.qnaList || [];
      return sum + comments.length + qnaList.length;
    }, 0);
    
    setStats({
      posts: posts.length,
      likes: totalLikes,
      comments: totalComments,
    });
    
    setLoading(false);
  }, [userId, navigate]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-layout bg-background-light dark:bg-background-dark">
      <div className="screen-content">
        {/* 헤더 */}
        <header className="screen-header bg-white dark:bg-gray-900 flex items-center p-4 justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex size-12 shrink-0 items-center justify-center text-text-primary-light dark:text-text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="text-text-primary-light dark:text-text-primary-dark text-base font-semibold">프로필</h1>
          <div className="w-12"></div>
        </header>

        {/* 메인 컨텐츠 */}
        <div className="screen-body">
          {/* 프로필 정보 */}
          <div className="bg-white dark:bg-gray-900 px-6 py-6">
            <div className="flex items-start gap-4 mb-4">
              {/* 프로필 사진 */}
              <div className="flex-shrink-0">
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                    <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-4xl">person</span>
                  </div>
                )}
              </div>

              {/* 사용자 정보 */}
              <div className="flex-1 min-w-0">
                {/* 프로필 이름, 대표 뱃지, 획득 뱃지 숫자를 한 줄에 가로 배치 */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold">
                    {user.username || '사용자'}
                  </h2>
                  
                  {/* 대표 뱃지 */}
                  {representativeBadge && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-primary/20 border-2 border-primary rounded-full">
                      <span className="text-xl">{representativeBadge.icon}</span>
                      <span className="text-xs font-semibold text-primary max-w-[80px] truncate">
                        {representativeBadge.name}
                      </span>
                    </div>
                  )}
                  
                  {/* 획득한 뱃지 개수 표시 */}
                  {earnedBadges.length > (representativeBadge ? 1 : 0) && (
                    <button
                      onClick={() => setShowAllBadges(true)}
                      className="min-w-[32px] h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center px-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        +{earnedBadges.length - (representativeBadge ? 1 : 0)}
                      </span>
                    </button>
                  )}
                </div>
                
              </div>
            </div>
          </div>

          {/* 통계 정보 */}
          <div className="bg-white dark:bg-gray-900 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {stats.posts}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">게시물</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {stats.likes}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">좋아요</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {stats.comments}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">댓글</div>
              </div>
            </div>
          </div>

          {/* 여행 기록 탭 */}
          <div className="bg-white dark:bg-gray-900 px-6 py-6 border-t border-gray-100 dark:border-gray-800">
            {userPosts.length === 0 ? (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">
                  photo_library
                </span>
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  아직 업로드한 사진이 없습니다
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {userPosts.map((post, index) => {
                  const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
                  const isLiked = likedPosts[post.id] || false;
                  const likeCount = post.likes || post.likeCount || 0;
                  
                  return (
                    <div
                      key={post.id || index}
                      onClick={() => {
                        navigate(`/post/${post.id}`, { 
                          state: { 
                            post: post,
                            allPosts: userPosts,
                            currentPostIndex: index
                          } 
                        });
                      }}
                      className="cursor-pointer"
                    >
                      {/* 이미지 */}
                      <div className="aspect-square relative overflow-hidden rounded-lg mb-2">
                        {post.videos && post.videos.length > 0 ? (
                          <video
                            src={post.videos[0]}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            muted
                            loop
                            playsInline
                          />
                        ) : (
                          <img
                            src={post.imageUrl || post.images?.[0] || post.image}
                            alt={post.location}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        )}
                        
                        {/* 우측 하단 하트 아이콘 */}
                        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className={`material-symbols-outlined text-sm ${isLiked ? 'text-red-500 fill' : 'text-gray-600'}`}>
                            favorite
                          </span>
                          <span className="text-xs font-semibold text-gray-700">{likeCount}</span>
                        </div>
                      </div>
                      
                      {/* 이미지 밖 하단 텍스트 */}
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-text-primary-light dark:text-text-primary-dark line-clamp-2">
                          {post.note || post.location || '여행 기록'}
                        </p>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span key={tagIndex} className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                #{typeof tag === 'string' ? tag.replace('#', '') : tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNavigation />

      {/* 뱃지 모두보기 모달 */}
      {showAllBadges && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
          onClick={() => setShowAllBadges(false)}
        >
          <div 
            className="bg-white dark:bg-gray-900 w-full max-w-[360px] rounded-3xl overflow-hidden mb-2 mx-2 flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: 'calc(100vh - 16px)' }}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">획득한 뱃지</h2>
              <button
                onClick={() => setShowAllBadges(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* 뱃지 그리드 - 스크롤 가능 */}
            <div className="p-4 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 120px)' }}>
              <div className="grid grid-cols-3 gap-4">
                {earnedBadges.map((badge, index) => {
                  const isRepresentative = representativeBadge?.name === badge.name;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center"
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                        isRepresentative
                          ? 'bg-primary/20 border-2 border-primary'
                          : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                      }`}>
                        <span className="text-3xl">{badge.icon}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white text-center mb-1">
                        {badge.name}
                      </p>
                      {isRepresentative && (
                        <span className="text-[10px] font-bold text-white bg-primary px-2 py-0.5 rounded">
                          대표
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileScreen;

