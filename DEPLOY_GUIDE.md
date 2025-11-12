# 🚀 LiveJourney 앱 배포 가이드

## 📋 목차
1. [백엔드 배포 (Heroku)](#1-백엔드-배포-heroku)
2. [MongoDB Atlas 설정](#2-mongodb-atlas-설정)
3. [프론트엔드 환경변수 업데이트](#3-프론트엔드-환경변수-업데이트)
4. [앱 재빌드](#4-앱-재빌드)

---

## 1. 백엔드 배포 (Heroku)

### 사전 준비:
- Heroku 계정 생성: https://signup.heroku.com/
- Heroku CLI 설치: https://devcenter.heroku.com/articles/heroku-cli

### 배포 단계:

```powershell
# 1. Heroku 로그인
heroku login

# 2. Heroku 앱 생성
cd C:\Users\wnd12\Desktop\mvp1\backend
heroku create livejourney-backend

# 3. Git 초기화 (backend 폴더에서)
git init
git add .
git commit -m "Initial commit"

# 4. Heroku에 배포
git push heroku main

# 5. 환경변수 설정
heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
heroku config:set FRONTEND_URL="https://your-frontend-url.com"
heroku config:set KAKAO_MAP_API_KEY="your_kakao_key"
heroku config:set KMA_API_KEY="your_kma_key"

# 6. 로그 확인
heroku logs --tail
```

### 배포 후 URL:
```
https://livejourney-backend.herokuapp.com
```

---

## 2. MongoDB Atlas 설정

### 단계:

1. **MongoDB Atlas 접속**
   - https://www.mongodb.com/cloud/atlas
   - 회원가입 / 로그인

2. **Cluster 생성**
   - "Build a Cluster" → Free (M0 Sandbox)
   - Provider: AWS
   - Region: Seoul (ap-northeast-2) 또는 Tokyo
   - Cluster Name: livejourney

3. **Database User 생성**
   ```
   Database Access → Add New Database User
   Username: livejourney_user
   Password: (강력한 비밀번호 생성)
   Role: Read and write to any database
   ```

4. **Network Access 설정**
   ```
   Network Access → Add IP Address
   → Allow Access from Anywhere (0.0.0.0/0)
   (프로덕션에서는 특정 IP만 허용 권장)
   ```

5. **Connection String 획득**
   ```
   Clusters → Connect → Connect your application
   → Copy connection string
   
   예시:
   mongodb+srv://livejourney_user:<password>@livejourney.xxxxx.mongodb.net/livejourney?retryWrites=true&w=majority
   
   ⚠️ <password>를 실제 비밀번호로 교체!
   ```

---

## 3. 프론트엔드 환경변수 업데이트

### web/.env.local 파일 수정:

```env
# API URL (배포된 백엔드 주소)
VITE_API_URL=https://livejourney-backend.herokuapp.com

# Kakao Map API Key
VITE_KAKAO_MAP_API_KEY=your_actual_kakao_key

# KMA (기상청) API Key
VITE_KMA_API_KEY=your_actual_kma_key
```

---

## 4. 앱 재빌드

### 프론트엔드 빌드:

```powershell
cd C:\Users\wnd12\Desktop\mvp1\web

# 1. 환경변수 업데이트 확인
# .env.local 파일이 올바른지 확인

# 2. 웹 빌드
npm run build

# 3. Capacitor 동기화
npx cap sync

# 4. Android 빌드
cd android
.\gradlew assembleDebug

# 5. APK 위치
# android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 🌐 Alternative: Railway 배포 (더 쉬움!)

### Railway 장점:
- 무료 티어
- GitHub 연동 자동 배포
- MongoDB 내장 지원

### Railway 배포 단계:

1. **Railway 가입**
   - https://railway.app/
   - GitHub 계정으로 로그인

2. **New Project**
   - "Deploy from GitHub repo"
   - mvp1 레포지토리 선택
   - Root Directory: `/backend` 설정

3. **MongoDB 추가**
   - "New" → "Database" → "MongoDB"
   - 자동으로 MONGODB_URI 환경변수 설정됨

4. **환경변수 추가**
   ```
   Variables 탭에서 추가:
   - FRONTEND_URL
   - KAKAO_MAP_API_KEY
   - KMA_API_KEY
   ```

5. **배포 URL**
   ```
   Settings → Generate Domain
   예: https://livejourney-backend.up.railway.app
   ```

---

## 📱 프론트엔드 배포 (선택사항)

### Vercel로 웹 배포:

```powershell
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 배포
cd C:\Users\wnd12\Desktop\mvp1\web
vercel

# 3. 프로덕션 배포
vercel --prod
```

### 환경변수 설정:
```
Vercel Dashboard → Project → Settings → Environment Variables
- VITE_API_URL
- VITE_KAKAO_MAP_API_KEY
- VITE_KMA_API_KEY
```

---

## ✅ 배포 체크리스트

### 백엔드:
- [ ] Heroku/Railway 배포 완료
- [ ] MongoDB Atlas 연결 확인
- [ ] 환경변수 모두 설정
- [ ] `/api/health` 엔드포인트 테스트
- [ ] CORS 설정 (FRONTEND_URL)

### 프론트엔드:
- [ ] .env.local 업데이트 (배포된 백엔드 URL)
- [ ] 웹 빌드 (`npm run build`)
- [ ] Capacitor 동기화 (`npx cap sync`)
- [ ] APK 재빌드 (`gradlew assembleDebug`)

### 테스트:
- [ ] 핸드폰에서 앱 설치
- [ ] 회원가입/로그인 작동
- [ ] 지도 표시 확인
- [ ] 사진 업로드 작동
- [ ] 게시물 불러오기 작동

---

## 🔧 문제 해결

### 백엔드 연결 안됨:
```powershell
# 백엔드 로그 확인
heroku logs --tail --app livejourney-backend
```

### MongoDB 연결 실패:
- Connection String의 비밀번호 확인
- Network Access에서 IP 허용 확인
- Database User 권한 확인

### CORS 에러:
```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

## 💰 비용

### 무료 티어:
- **Heroku**: 월 550시간 무료 (1개 앱)
- **Railway**: 월 $5 크레딧 무료
- **MongoDB Atlas**: 512MB 무료
- **Vercel**: 무제한 배포 무료

### 유료 전환 시점:
- 사용자 1000명 이상
- 데이터 512MB 초과
- 트래픽 급증

---

## 📚 추가 리소스

- Heroku 가이드: https://devcenter.heroku.com/
- Railway 가이드: https://docs.railway.app/
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Capacitor 배포: https://capacitorjs.com/docs/deploying

---

끝! 🎉

