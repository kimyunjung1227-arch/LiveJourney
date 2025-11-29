import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MockDataLoader from './components/MockDataLoader'
import { initStatusBar } from './utils/statusBar'
import { getBadgeCongratulationMessage } from './utils/badgeMessages'

// Pages
import WelcomeScreen from './pages/WelcomeScreen'
import StartScreen from './pages/StartScreen'
import AuthCallbackScreen from './pages/AuthCallbackScreen'
import MainScreen from './pages/MainScreen'
import SearchScreen from './pages/SearchScreen'
import DetailScreen from './pages/DetailScreen'
import PostDetailScreen from './pages/PostDetailScreen'
import RegionDetailScreen from './pages/RegionDetailScreen'
import RegionCategoryScreen from './pages/RegionCategoryScreen'
import UploadScreen from './pages/UploadScreen'
import MapScreen from './pages/MapScreen'
import MapPhotoGridScreen from './pages/MapPhotoGridScreen'
import ProfileScreen from './pages/ProfileScreen'
import UserProfileScreen from './pages/UserProfileScreen'
import EditProfileScreen from './pages/EditProfileScreen'
import PersonalInfoEditScreen from './pages/PersonalInfoEditScreen'
import PasswordChangeScreen from './pages/PasswordChangeScreen'
import AccountConnectionScreen from './pages/AccountConnectionScreen'
import AccountDeleteScreen from './pages/AccountDeleteScreen'
import AccountDeleteConfirmScreen from './pages/AccountDeleteConfirmScreen'
import BadgeListScreen from './pages/BadgeListScreen'
import BadgeAchievementScreen from './pages/BadgeAchievementScreen'
import MyCouponsScreen from './pages/MyCouponsScreen'
import SettingsScreen from './pages/SettingsScreen'
import FeedUpdateFrequencyScreen from './pages/FeedUpdateFrequencyScreen'
import NoticesScreen from './pages/NoticesScreen'
import FAQScreen from './pages/FAQScreen'
import InquiryScreen from './pages/InquiryScreen'
import TermsAndPoliciesScreen from './pages/TermsAndPoliciesScreen'
import TermsOfServiceScreen from './pages/TermsOfServiceScreen'
import NotificationsScreen from './pages/NotificationsScreen'

function App() {
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState(null);

  // StatusBar 초기화 (앱 시작 시 한 번만)
  useEffect(() => {
    initStatusBar();
  }, []);

  // 전역 뱃지 획득 이벤트 리스너
  useEffect(() => {
    const handleBadgeEarned = (event) => {
      const badge = event.detail;
      console.log('🎉 전역 뱃지 획득 이벤트 수신:', badge);
      setEarnedBadge(badge);
      setShowBadgeModal(true);
    };

    window.addEventListener('badgeEarned', handleBadgeEarned);

    return () => {
      window.removeEventListener('badgeEarned', handleBadgeEarned);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <MockDataLoader />
          <div className="page-wrapper">
            <Routes>
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/start" element={<StartScreen />} />
              <Route path="/auth/callback" element={<AuthCallbackScreen />} />
              {/* 핵심 탐색 기능은 로그인 없이도 사용 가능 */}
              <Route path="/main" element={<MainScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/detail" element={<DetailScreen />} />
              <Route path="/post/:id" element={<PostDetailScreen />} />
              <Route path="/region/:regionName" element={<RegionDetailScreen />} />
              <Route path="/region/:regionName/category" element={<RegionCategoryScreen />} />
              <Route path="/upload" element={<ProtectedRoute><UploadScreen /></ProtectedRoute>} />
              <Route path="/map" element={<MapScreen />} />
              <Route path="/map/photos" element={<MapPhotoGridScreen />} />
              <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
              <Route path="/user/:userId" element={<ProtectedRoute><UserProfileScreen /></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><EditProfileScreen /></ProtectedRoute>} />
              <Route path="/personal-info-edit" element={<ProtectedRoute><PersonalInfoEditScreen /></ProtectedRoute>} />
              <Route path="/password-change" element={<ProtectedRoute><PasswordChangeScreen /></ProtectedRoute>} />
              <Route path="/account-connection" element={<ProtectedRoute><AccountConnectionScreen /></ProtectedRoute>} />
              <Route path="/account-delete" element={<ProtectedRoute><AccountDeleteScreen /></ProtectedRoute>} />
              <Route path="/account-delete/confirm" element={<ProtectedRoute><AccountDeleteConfirmScreen /></ProtectedRoute>} />
              <Route path="/badges" element={<ProtectedRoute><BadgeListScreen /></ProtectedRoute>} />
              <Route path="/badge-achievement/:badgeId" element={<ProtectedRoute><BadgeAchievementScreen /></ProtectedRoute>} />
              <Route path="/badge/achievement" element={<ProtectedRoute><BadgeAchievementScreen /></ProtectedRoute>} />
              <Route path="/coupons" element={<ProtectedRoute><MyCouponsScreen /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
              <Route path="/feed-update-frequency" element={<ProtectedRoute><FeedUpdateFrequencyScreen /></ProtectedRoute>} />
              <Route path="/notices" element={<ProtectedRoute><NoticesScreen /></ProtectedRoute>} />
              <Route path="/faq" element={<ProtectedRoute><FAQScreen /></ProtectedRoute>} />
              <Route path="/inquiry" element={<ProtectedRoute><InquiryScreen /></ProtectedRoute>} />
              <Route path="/terms-and-policies" element={<ProtectedRoute><TermsAndPoliciesScreen /></ProtectedRoute>} />
              <Route path="/terms-of-service" element={<ProtectedRoute><TermsOfServiceScreen /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>

      {/* 전역 뱃지 획득 모달 */}
      {showBadgeModal && earnedBadge && (() => {
        const message = getBadgeCongratulationMessage(earnedBadge.name);
        return (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 animate-fade-in">
            <div className="w-full max-w-sm transform rounded-3xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-zinc-800 dark:to-zinc-900 p-8 shadow-2xl border-4 border-primary animate-scale-up">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary via-primary to-accent shadow-2xl">
                    <span className="text-6xl">{earnedBadge.icon || '🏆'}</span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-yellow-400/40 animate-ping"></div>
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-xl animate-bounce">
                    NEW!
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-center mb-3 text-zinc-900 dark:text-white">
                {message.title || '축하합니다!'}
              </h1>
              
              <p className="text-xl font-bold text-center text-primary mb-2">
                {earnedBadge.name || earnedBadge}
              </p>
              
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                  earnedBadge.difficulty === '상' ? 'bg-primary-dark text-white' :
                  earnedBadge.difficulty === '중' ? 'bg-blue-500 text-white' :
                  'bg-green-500 text-white'
                }`}>
                  난이도: {earnedBadge.difficulty || '하'}
                </div>
              </div>
              
              <p className="text-base font-medium text-center text-zinc-700 dark:text-zinc-300 mb-2">
                {message.subtitle || '뱃지를 획득했습니다!'}
              </p>
              
              <p className="text-sm text-center text-zinc-600 dark:text-zinc-400 mb-8 whitespace-pre-line">
                {message.message || earnedBadge.description || '여행 기록을 계속 쌓아가며 더 많은 뱃지를 획득해보세요!'}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowBadgeModal(false);
                    window.location.href = '/badges';
                  }}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  내 프로필에서 확인하기
                </button>
                <button
                  onClick={() => {
                    setShowBadgeModal(false);
                  }}
                  className="w-full bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 py-4 rounded-xl font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-all transform hover:scale-105 active:scale-95"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </AuthProvider>
  )
}

export default App




























