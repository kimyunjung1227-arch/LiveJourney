/**
 * StatusBar 유틸리티
 * 핸드폰 상단 상태바 제어
 */

import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

// StatusBar 초기화
export const initStatusBar = async () => {
  // 네이티브 플랫폼에서만 실행
  if (!Capacitor.isNativePlatform()) {
    console.log('🌐 웹 브라우저 - StatusBar 설정 건너뜀');
    return;
  }

  try {
    console.log('📱 StatusBar 초기화 시작...');

    // StatusBar 표시
    await StatusBar.show();

    // 스타일 설정 (어두운 아이콘 - 흰색 배경에 맞춤)
    await StatusBar.setStyle({ style: Style.Dark });

    // 배경색 설정 (흰색)
    await StatusBar.setBackgroundColor({ color: '#ffffff' });

    // WebView 오버레이 비활성화 (앱이 상태바 아래에서 시작)
    await StatusBar.setOverlaysWebView({ overlay: false });

    console.log('✅ StatusBar 설정 완료!');
    console.log('  - 스타일: Dark (어두운 아이콘)');
    console.log('  - 배경색: #ffffff (흰색)');
    console.log('  - 오버레이: false (상태바 영역 보호)');
  } catch (error) {
    console.error('❌ StatusBar 설정 실패:', error);
  }
};

// StatusBar 숨기기
export const hideStatusBar = async () => {
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    await StatusBar.hide();
  } catch (error) {
    console.error('StatusBar 숨기기 실패:', error);
  }
};

// StatusBar 보이기
export const showStatusBar = async () => {
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    await StatusBar.show();
  } catch (error) {
    console.error('StatusBar 표시 실패:', error);
  }
};

// StatusBar 스타일 변경
export const setStatusBarStyle = async (isDark = true) => {
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    await StatusBar.setStyle({ 
      style: isDark ? Style.Dark : Style.Light 
    });
  } catch (error) {
    console.error('StatusBar 스타일 변경 실패:', error);
  }
};

// StatusBar 배경색 변경
export const setStatusBarColor = async (color) => {
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    await StatusBar.setBackgroundColor({ color });
  } catch (error) {
    console.error('StatusBar 색상 변경 실패:', error);
  }
};

