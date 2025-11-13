/**
 * 소셜 기능 유틸리티
 * 좋아요, 댓글, 북마크 관리
 */

// 좋아요 토글
export const toggleLike = (postId) => {
  const likes = JSON.parse(localStorage.getItem('likedPosts') || '{}');
  const isLiked = likes[postId] || false;
  
  likes[postId] = !isLiked;
  localStorage.setItem('likedPosts', JSON.stringify(likes));
  
  // 게시물의 좋아요 수 업데이트
  const posts = JSON.parse(localStorage.getItem('uploadedPosts') || '[]');
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      const newLikes = (post.likes || 0) + (isLiked ? -1 : 1);
      return { ...post, likes: Math.max(0, newLikes) };
    }
    return post;
  });
  
  localStorage.setItem('uploadedPosts', JSON.stringify(updatedPosts));
  
  return {
    isLiked: !isLiked,
    newCount: updatedPosts.find(p => p.id === postId)?.likes || 0
  };
};

// 좋아요 여부 확인
export const isPostLiked = (postId) => {
  const likes = JSON.parse(localStorage.getItem('likedPosts') || '{}');
  return likes[postId] || false;
};

// 댓글 추가
export const addComment = (postId, comment, username = '익명') => {
  const posts = JSON.parse(localStorage.getItem('uploadedPosts') || '[]');
  
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      const newComment = {
        id: `comment-${Date.now()}`,
        user: username,
        content: comment,
        timestamp: new Date().toISOString(),
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      };
      
      return {
        ...post,
        comments: [...(post.comments || []), newComment]
      };
    }
    return post;
  });
  
  localStorage.setItem('uploadedPosts', JSON.stringify(updatedPosts));
  
  const post = updatedPosts.find(p => p.id === postId);
  return post?.comments || [];
};

// 북마크 토글
export const toggleBookmark = (post) => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
  const isBookmarked = bookmarks.some(b => b.id === post.id);
  
  let updatedBookmarks;
  if (isBookmarked) {
    updatedBookmarks = bookmarks.filter(b => b.id !== post.id);
  } else {
    updatedBookmarks = [...bookmarks, post];
  }
  
  localStorage.setItem('bookmarkedPosts', JSON.stringify(updatedBookmarks));
  
  return {
    isBookmarked: !isBookmarked,
    totalBookmarks: updatedBookmarks.length
  };
};

// 북마크 여부 확인
export const isPostBookmarked = (postId) => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
  return bookmarks.some(b => b.id === postId);
};

// 북마크 목록 가져오기
export const getBookmarkedPosts = () => {
  return JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');
};


