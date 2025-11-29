@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 Expo 개발 서버 시작
echo ========================================
echo.

cd /d "%~dp0"
cd mobile

echo 📱 Mobile 폴더로 이동 완료
echo.

echo 📦 의존성 확인 중...
if not exist "node_modules" (
    echo ⚠️  node_modules 폴더가 없습니다. npm install을 실행합니다...
    call npm install
    echo.
)

echo ✅ Expo 서버 시작 중 (Tunnel 모드)...
echo.
echo 💡 Tunnel 모드는 다른 네트워크에서도 연결 가능합니다.
echo 💡 Expo Go 앱에서 QR 코드를 스캔하세요!
echo.
echo ========================================
echo.

call npm run tunnel

pause

