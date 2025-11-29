import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { seedMockData } from '../utils/mockUploadData';
import LiveJourneyLogo from '../components/LiveJourneyLogo';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const { testerLogin } = useAuth();

  React.useEffect(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏠 LiveJourney 시작화면 표시');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Mock 데이터는 개발 모드에서만 생성 (최소화)
    if (import.meta.env.MODE === 'development') {
      const timer = setTimeout(() => {
        try {
          const existingPosts = JSON.parse(localStorage.getItem('uploadedPosts') || '[]');
          // Mock 데이터 생성 비활성화 - 프로덕션 모드
          console.log(`📊 현재 게시물: ${existingPosts.length}개`);
        } catch (error) {
          console.error('Mock 데이터 생성 오류:', error);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      console.log('🚫 [프로덕션] Mock 데이터 생성 건너뜀');
    }
  }, []);

  const handleStart = () => {
    // "앱 시작하기" 버튼 클릭 시 - 로그인 없이 메인 화면으로 진입
    console.log('🚀 앱 시작하기 버튼 클릭 → 메인 화면으로 이동 (게스트 모드 가능)');
    navigate('/main');
  };

  const handleTesterLogin = async () => {
    console.log('🧪 테스터 계정으로 바로 로그인');
    try {
      const result = await testerLogin();
      if (result.success) {
        navigate('/main', { replace: true });
      } else {
        console.error('테스터 로그인 실패:', result.error);
        // 실패해도 로그인 화면으로 이동
        navigate('/start');
      }
    } catch (error) {
      console.error('테스터 로그인 오류:', error);
      navigate('/start');
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-white dark:bg-zinc-900 font-display">
      {/* 중앙 컨텐츠 */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center py-12">
        <div className="flex flex-col items-center justify-center gap-6">
          <LiveJourneyLogo size={180} showText={true} />
          <p className="text-black dark:text-white text-xl font-bold leading-relaxed max-w-sm mt-2 px-4">
            당신의 모든 여정이 스마트하고<br/>즐거워 지는 것을 목표로 합니다
          </p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex-shrink-0 w-full px-8 pb-12 space-y-3">
        <button 
          onClick={handleTesterLogin}
          className="flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-14 px-5 bg-gradient-to-r from-primary to-primary-dark text-white text-base font-bold leading-normal tracking-[0.015em] w-full hover:from-primary-dark hover:to-primary-dark active:scale-95 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-lg">bug_report</span>
          <span className="truncate">테스터 계정으로 바로 시작</span>
        </button>
        <button 
          onClick={handleStart}
          className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-primary text-white text-lg font-bold leading-normal tracking-[0.015em] w-full hover:shadow-2xl active:scale-95 transition-all shadow-xl"
        >
          <span className="truncate">앱 시작하기</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;

