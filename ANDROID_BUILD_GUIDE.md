# 📱 Android 앱 빌드 & 설치 가이드

## ✅ 완료된 단계:

1. ✅ 웹 앱 빌드 완료 (`npm run build`)
2. ✅ Capacitor 동기화 완료 (`npx cap sync`)
3. ✅ Android Studio 실행 중

---

## 🔨 Android Studio에서 APK 빌드:

### **방법 1: Android Studio GUI 사용** (추천)

Android Studio가 열리면:

1. **프로젝트 로딩 대기**
   - Gradle 빌드가 완료될 때까지 기다리기 (2-5분 소요)
   - 하단에 "Gradle build finished" 메시지 확인

2. **APK 빌드**
   ```
   메뉴: Build → Build Bundle(s) / APK(s) → Build APK(s)
   ```
   - 또는: `Ctrl + Shift + A` → "Build APK" 검색

3. **APK 위치**
   ```
   C:\Users\wnd12\Desktop\mvp1\web\android\app\build\outputs\apk\debug\app-debug.apk
   ```

4. **핸드폰에 설치**
   - USB 케이블로 핸드폰 연결
   - 핸드폰에서 "개발자 옵션" → "USB 디버깅" 활성화
   - Android Studio에서 녹색 ▶ 버튼 클릭
   - 또는 APK 파일을 핸드폰으로 전송 후 직접 설치

---

### **방법 2: 명령줄에서 빌드** (빠름)

새 PowerShell 창에서:

```powershell
cd C:\Users\wnd12\Desktop\mvp1\web\android
.\gradlew assembleDebug
```

빌드 완료 후:
```
APK 위치: android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📲 핸드폰에 설치:

### **방법 A: USB 케이블 사용**

1. **핸드폰 설정**
   - 설정 → 휴대전화 정보 → 빌드 번호 7번 탭 (개발자 모드 활성화)
   - 설정 → 개발자 옵션 → USB 디버깅 켜기

2. **ADB 설치 확인**
   ```powershell
   adb devices
   ```
   
3. **APK 설치**
   ```powershell
   cd C:\Users\wnd12\Desktop\mvp1\web\android\app\build\outputs\apk\debug
   adb install -r app-debug.apk
   ```

### **방법 B: 파일 전송**

1. APK 파일을 핸드폰으로 전송 (카카오톡, 이메일, USB 등)
2. 핸드폰에서 APK 파일 클릭
3. "알 수 없는 출처" 허용
4. 설치 완료!

---

## 🎯 앱 실행:

설치 후 "LiveJourney" 아이콘을 찾아서 실행!

---

## ⚠️ 문제 해결:

### **Android Studio가 열리지 않음**
- Android Studio가 설치되어 있는지 확인
- 없으면 https://developer.android.com/studio 에서 다운로드

### **Gradle 빌드 실패**
```powershell
cd C:\Users\wnd12\Desktop\mvp1\web\android
.\gradlew clean
.\gradlew assembleDebug
```

### **APK 설치 실패**
- 핸드폰 "알 수 없는 출처" 허용 확인
- 이전 버전 삭제 후 재설치

---

## 🚀 빠른 재빌드 (코드 수정 후):

```powershell
# 1. 웹 빌드
cd C:\Users\wnd12\Desktop\mvp1\web
npm run build

# 2. Capacitor 동기화
npx cap sync

# 3. Android 빌드
cd android
.\gradlew assembleDebug

# 4. 설치
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

---

## 📝 참고:

- **Debug APK**: 개발/테스트용 (파일 크기 큼)
- **Release APK**: 배포용 (최적화, 서명 필요)
  ```powershell
  .\gradlew assembleRelease
  ```

---

끝! 🎉

