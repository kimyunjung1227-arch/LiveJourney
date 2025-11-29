@echo off
echo ========================================
echo   LiveJourney 프론트엔드 서버 시작
echo ========================================
echo.
echo 프론트엔드 서버 시작 중... (포트 3000)
echo 브라우저에서 http://localhost:3000 으로 접속하세요.
echo.

cd /d %~dp0web
npm start

pause



