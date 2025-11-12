# 📱 StatusBar 수정 완료!

## ✅ 완료된 작업:

### 1. **StatusBar 플러그인 설치**
```powershell
npm install @capacitor/status-bar
```

### 2. **Capacitor 설정 업데이트**
```json
{
  "plugins": {
    "StatusBar": {
      "style": "DARK",
      "backgroundColor": "#ffffff",
      "overlaysWebView": false  // ← 이게 핵심!
    }
  }
}
```

**`overlaysWebView: false`의 의미:**
- `true`: 앱이 상태바를 덮어씀 (문제 발생!)
- `false`: 앱이 상태바 아래에서 시작 (정상!)

### 3. **StatusBar 유틸리티 생성**
```javascript
// web/src/utils/statusBar.js
import { StatusBar, Style } from '@capacitor/status-bar';

export const initStatusBar = async () => {
  await StatusBar.show();
  await StatusBar.setStyle({ style: Style.Dark });
  await StatusBar.setBackgroundColor({ color: '#ffffff' });
  await StatusBar.setOverlaysWebView({ overlay: false });
};
```

### 4. **App.jsx에서 초기화**
```javascript
import { initStatusBar } from './utils/statusBar';

function App() {
  useEffect(() => {
    initStatusBar();
  }, []);
  
  // ...
}
```

### 5. **Capacitor Sync 완료**
```
[info] Found 1 Capacitor plugin for android:
       @capacitor/status-bar@7.0.3 ✅
```

---

## 📲 새 APK 빌드:

### **Android Studio에서:**
1. Gradle 빌드 완료 대기
2. `Build → Build Bundle(s) / APK(s) → Build APK(s)`
3. APK 생성 완료!

### **또는 명령줄에서:**
```powershell
cd C:\Users\wnd12\Desktop\mvp1\web\android
.\gradlew assembleDebug
```

---

## 🎯 이제 이렇게 바뀝니다:

### **Before (문제):**
```
┌──────────────────────┐
│ 12:00  📶  🔋       │ ← 시스템 UI
├──────────────────────┤
│ 프로필 (앱 내용)      │ ← 앱이 여기까지 올라감 ❌
│                      │
```

### **After (수정):**
```
┌──────────────────────┐
│ 12:00  📶  🔋       │ ← 시스템 UI (보호됨!)
├──────────────────────┤
│ ← 프로필          ⚙️  │ ← 앱 헤더 (여기부터 시작 ✅)
│                      │
│ 테스트유저            │
```

---

## 📝 주요 변경 사항:

### **capacitor.config.json:**
```diff
"StatusBar": {
  "style": "DARK",
  "backgroundColor": "#ffffff",
+ "overlaysWebView": false
}
```

### **App.jsx:**
```diff
+ import { initStatusBar } from './utils/statusBar'

function App() {
+   useEffect(() => {
+     initStatusBar();
+   }, []);
```

---

## 🔍 테스트 방법:

1. 새 APK를 핸드폰에 설치
2. 앱 실행
3. ✅ 상태바가 흰색 배경으로 표시됨
4. ✅ 앱 헤더가 상태바 아래에서 시작함
5. ✅ 시간, 배터리 아이콘이 선명하게 보임

---

## 🎨 다크모드 대응 (선택사항):

나중에 다크모드를 추가할 때:

```javascript
// 다크모드일 때
await StatusBar.setStyle({ style: Style.Light });  // 밝은 아이콘
await StatusBar.setBackgroundColor({ color: '#000000' });

// 라이트모드일 때
await StatusBar.setStyle({ style: Style.Dark });   // 어두운 아이콘
await StatusBar.setBackgroundColor({ color: '#ffffff' });
```

---

## 📚 StatusBar API 추가 기능:

```javascript
import { StatusBar } from '@capacitor/status-bar';

// 상태바 숨기기 (전체화면 모드)
await StatusBar.hide();

// 상태바 보이기
await StatusBar.show();

// 현재 정보 가져오기
const info = await StatusBar.getInfo();
console.log(info);
// {
//   visible: true,
//   style: "DARK",
//   color: "#ffffff"
// }
```

---

끝! 🎉

이제 핸드폰에서 앱이 시스템 UI를 침범하지 않습니다!

