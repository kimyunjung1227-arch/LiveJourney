# 📱 Expo 실행 가이드

## 🚀 빠른 시작

### 방법 1: 배치 파일 사용 (가장 쉬움)

1. **프로젝트 루트 폴더**에서 다음 파일을 더블클릭:
   - `START_EXPO.bat` - 일반 모드 (같은 Wi-Fi 필요)
   - `START_EXPO_TUNNEL.bat` - 터널 모드 (다른 네트워크에서도 가능)

2. 터미널에 QR 코드가 표시됩니다.

3. **Expo Go 앱**에서 QR 코드를 스캔하세요.

### 방법 2: 수동 실행

```bash
# 프로젝트 루트에서
cd mobile
npm start
```

터널 모드 (다른 네트워크):
```bash
cd mobile
npm run tunnel
```

## 📱 Expo Go 앱 설치

### Android
- [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)에서 다운로드

### iOS
- [App Store](https://apps.apple.com/app/expo-go/id982107779)에서 다운로드

## 🔗 연결 방법

### Android
1. Expo Go 앱 열기
2. "Scan QR code" 선택
3. 터미널의 QR 코드 스캔

### iOS
1. 카메라 앱 열기
2. QR 코드 스캔
3. 알림에서 "Expo Go로 열기" 선택

## ⚠️ 문제 해결

### node_modules가 없는 경우
```bash
cd mobile
npm install
```

### 포트가 이미 사용 중인 경우
터미널에서 `r` 키를 눌러 Metro bundler를 재시작하세요.

### 연결이 안 되는 경우
- 같은 Wi-Fi에 연결되어 있는지 확인
- 방화벽 설정 확인
- `START_EXPO_TUNNEL.bat` 사용 (터널 모드)

## 📂 폴더 구조

```
mvp1/
├── mobile/          # Expo 프로젝트
│   ├── App.js       # 앱 진입점
│   ├── app.json     # Expo 설정
│   ├── package.json # 의존성
│   └── src/         # 소스 코드
├── START_EXPO.bat        # 일반 모드 실행
└── START_EXPO_TUNNEL.bat # 터널 모드 실행
```



