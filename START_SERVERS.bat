@echo off
echo ========================================
echo   LiveJourney 서버 시작
echo ========================================
echo.

REM 현재 디렉토리 저장
set PROJECT_DIR=%~dp0

REM 백엔드 서버 시작 (새 창)
echo 백엔드 서버 시작 중... (포트 5000)
start "LiveJourney Backend Server" cmd /k "cd /d %PROJECT_DIR%backend && npm start"

REM 2초 대기
timeout /t 2 /nobreak >nul

REM 프론트엔드 서버 시작 (새 창)
echo 프론트엔드 서버 시작 중... (포트 3000)
start "LiveJourney Frontend Server" cmd /k "cd /d %PROJECT_DIR%web && npm start"

echo.
echo ========================================
echo   서버가 별도 창에서 시작되었습니다!
echo ========================================
echo.
echo 프론트엔드: http://localhost:3000
echo 백엔드 API: http://localhost:5000
echo.
echo 서버를 종료하려면 각 창을 닫으세요.
echo.
pause



