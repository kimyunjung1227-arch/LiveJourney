@echo off
echo ========================================
echo   LiveJourney 백엔드 서버 시작
echo ========================================
echo.
echo 백엔드 서버 시작 중... (포트 5000)
echo API: http://localhost:5000
echo.

cd /d %~dp0backend
npm start

pause



