# 📱 Android 앱 빌드 & 설치 가이드 (모바일 앱)

## 🚀 빠른 시작: Expo로 앱 실행하기

**가장 쉬운 방법**: Expo Go 앱으로 바로 확인하기

1. **배치 파일 실행**
   - `mobile/START_EXPO.bat` 파일을 더블클릭
   - 또는 `mobile/START_EXPO_ANDROID.bat` (Android 직접 실행)

2. **스마트폰에서 확인**
   - Expo Go 앱 설치: [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779)
   - 터미널에 표시된 QR 코드 스캔
   - 앱이 자동으로 로드됩니다!

**자세한 가이드**: `mobile/EXPO_RUN_GUIDE.md` 파일 참고

---

## ✅ 모바일 앱 빌드 준비:

1. ✅ 모바일 앱 프로젝트 확인 (`mobile/` 폴더)
2. ✅ Expo 프로젝트 확인 (`app.json` 존재)
3. ✅ Android 네이티브 코드 생성 (필요시)
4. ✅ Android Studio에서 모바일 프로젝트 열기
5. ✅ Gradle 동기화 완료

### **중요: Expo 프로젝트인 경우**

Expo 프로젝트는 Android Studio에서 빌드하기 전에 네이티브 코드를 생성해야 합니다:

```powershell
cd C:\Users\wnd12\Desktop\mvp1\mobile
npx expo prebuild --platform android --clean
```

이 명령은 `android` 폴더의 네이티브 코드를 최신 상태로 재생성합니다.

---

## 🔨 Android Studio에서 APK 빌드:

### **중요: 올바른 프로젝트 폴더 열기**

**Android Studio에서 다음 폴더를 열어야 합니다:**
```
C:\Users\wnd12\Desktop\mvp1\mobile\android
```

⚠️ **주의**: `web\android`가 아닌 `mobile\android` 폴더를 열어야 합니다!

### **방법 1: Android Studio GUI 사용** (추천)

1. **Android Studio에서 프로젝트 열기**
   - `File` → `Open`
   - `C:\Users\wnd12\Desktop\mvp1\mobile\android` 선택
   - **루트 폴더(`mvp1`)가 아닌 `mobile\android` 폴더를 직접 열어야 합니다!**

2. **프로젝트 로딩 대기**
   - Gradle 빌드가 완료될 때까지 기다리기 (2-5분 소요)
   - 하단에 "Gradle build finished" 메시지 확인
   - 빌드 버튼이 활성화될 때까지 대기

3. **Gradle 동기화** (필요시)
   - `File` → `Sync Project with Gradle Files`
   - 또는 상단 툴바의 Gradle 동기화 아이콘 클릭

4. **APK 빌드**
   ```
   메뉴: Build → Build Bundle(s) / APK(s) → Build APK(s)
   ```
   - 또는: `Ctrl + Shift + A` → "Build APK" 검색

5. **APK 위치**
   ```
   C:\Users\wnd12\Desktop\mvp1\mobile\android\app\build\outputs\apk\debug\app-debug.apk
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
cd C:\Users\wnd12\Desktop\mvp1\mobile\android
.\gradlew assembleDebug
```

빌드 완료 후:
```
APK 위치: mobile\android\app\build\outputs\apk\debug\app-debug.apk
```

**참고**: `mobile/android` 폴더에 `gradlew` 파일이 없으면 Expo 프로젝트이므로 다음 방법 사용:
```powershell
cd C:\Users\wnd12\Desktop\mvp1\mobile
npx expo prebuild --platform android
cd android
.\gradlew assembleDebug
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
   cd C:\Users\wnd12\Desktop\mvp1\mobile\android\app\build\outputs\apk\debug
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
cd C:\Users\wnd12\Desktop\mvp1\mobile\android
.\gradlew clean
.\gradlew assembleDebug
```

### **빌드 버튼이 잠겨있음**
1. Android Studio에서 `mobile\android` 폴더를 직접 열었는지 확인
2. `File` → `Sync Project with Gradle Files` 실행
3. `File` → `Invalidate Caches / Restart...` → `Invalidate and Restart`
4. Gradle 동기화 완료 대기 (하단 상태바 확인)

### **Gradle과 Java 버전 호환성 오류**
**오류**: "incompatible Java 21.0.8 and Gradle 8.3"

**해결 방법**:
1. ✅ Gradle 버전이 8.13 이상으로 업그레이드되었는지 확인
   - `mobile/android/gradle/wrapper/gradle-wrapper.properties` 파일에서 `gradle-8.13-bin.zip` 확인
2. Android Studio에서 `File` → `Sync Project with Gradle Files` 실행
3. 여전히 문제가 있으면:
   - `File` → `Project Structure` → `SDK Location`
   - JDK 버전을 Java 20 이하로 변경 (선택사항)
   - 또는 Android Studio 내장 JDK 사용

### **React Native CLI 파일 누락 오류**
**오류**: "Could not read script 'native_modules.gradle' as it does not exist"

**해결 방법**:
1. **방법 1: 필요한 패키지 설치** (권장)
   ```powershell
   cd C:\Users\wnd12\Desktop\mvp1\mobile
   npm install @react-native-community/cli-platform-android --save-dev
   ```

2. **방법 2: Expo prebuild 실행** (Expo 프로젝트인 경우 - **가장 권장**)
   ```powershell
   cd C:\Users\wnd12\Desktop\mvp1\mobile
   npx expo prebuild --platform android --clean
   ```
   이 명령은 Android 네이티브 코드를 다시 생성합니다.

3. **방법 3: settings.gradle 수정** (이미 적용됨)
   - `settings.gradle` 파일이 React Native CLI가 없어도 작동하도록 수정되었습니다.
   - Android Studio에서 다시 동기화하세요.

### **Autolinking 파일 누락 오류**
**오류**: "autolinking.json which doesn't exist" 또는 "generateAutolinkingPackageList FAILED"

**해결 방법**:
1. **방법 1: Expo prebuild 실행** (가장 권장)
   ```powershell
   cd C:\Users\wnd12\Desktop\mvp1\mobile
   npx expo prebuild --platform android --clean
   ```
   이 명령은 모든 필요한 네이티브 파일과 autolinking.json을 생성합니다.

2. **방법 2: 빌드 디렉토리 정리 후 재빌드**
   ```powershell
   cd C:\Users\wnd12\Desktop\mvp1\mobile\android
   .\gradlew clean
   ```
   그 후 Android Studio에서 다시 빌드하세요.

3. **방법 3: 임시 autolinking.json 생성** (이미 적용됨)
   - 빈 autolinking.json 파일이 생성되었습니다.
   - 하지만 Expo prebuild를 실행하는 것이 더 안전합니다.

### **PackageName 누락 오류**
**오류**: "Could not find project.android.packageName in react-native config output!"

**해결 방법**:
1. ✅ `react-native.config.js` 파일 생성됨 (이미 적용됨)
   - `mobile/react-native.config.js` 파일에 packageName이 설정되었습니다.

2. **방법 1: Expo prebuild 실행** (가장 권장)
   ```powershell
   cd C:\Users\wnd12\Desktop\mvp1\mobile
   npx expo prebuild --platform android --clean
   ```
   이 명령은 모든 필요한 설정 파일을 올바르게 생성합니다.

3. **방법 2: Android Studio에서 다시 동기화**
   - `File` → `Sync Project with Gradle Files`
   - `react-native.config.js` 파일이 인식되도록 합니다.

### **Flipper 통합 오류**
**오류**: "Failed to resolve: com.facebook.react:flipper-integration"

**해결 방법**:
1. ✅ `mobile/android/app/build.gradle` 파일에서 Flipper 의존성 제거됨
2. Android Studio에서 `File` → `Sync Project with Gradle Files` 실행
3. Flipper는 디버깅 도구이므로 제거해도 앱 빌드에는 문제 없습니다

### **APK 설치 실패**
- 핸드폰 "알 수 없는 출처" 허용 확인
- 이전 버전 삭제 후 재설치

---

## 🚀 빠른 재빌드 (코드 수정 후):

### **모바일 앱 (Expo/React Native)**

```powershell
# 1. 모바일 앱 디렉토리로 이동
cd C:\Users\wnd12\Desktop\mvp1\mobile

# 2. Android 네이티브 코드 생성 (처음 한 번만)
npx expo prebuild --platform android

# 3. Android 빌드
cd android
.\gradlew assembleDebug

# 4. 설치
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

### **또는 Expo로 직접 실행** (개발용)

```powershell
cd C:\Users\wnd12\Desktop\mvp1\mobile
npx expo run:android
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

