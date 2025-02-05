# Drop In File

구글 드라이브와 같은 직관적인 파일 저장 시스템에서 영감을 받아, Firebase를 기반으로 개인화된 파일 관리 시스템을 개발했습니다.

**Link:** [Drop In File](https://fir-skilup.web.app/)

## 프로젝트 설명
이 프로젝트는 사용자가 언제 어디서나 편리하게 파일을 저장하고 관리할 수 있도록 설계되었습니다. 실시간 데이터 관리, 직관적인 UI/UX, 그리고 최적화된 성능을 통해 사용자 경험을 극대화하였습니다.

## 주요 기능 및 특징

### 🔐 **인증 및 보안**
- **Firebase Authentication**을 활용하여 Google 계정을 통한 간편한 로그인 및 인증 기능 구현
- `onAuthStateChanged`를 사용하여 로그인된 사용자만 파일에 접근하고 관리할 수 있도록 설정

### 🌙 **다크 모드 지원**
- **Recoil의 atom**을 사용해 다크모드 상태를 전역적으로 관리하며, 컴포넌트 간 상태 공유를 간소화
- 애플리케이션 초기 로드 시 `useEffect`를 통해 `localStorage`에서 저장된 다크모드 상태를 불러와 Recoil 상태에 반영
- 상태 변경 시 `localStorage`와 동기화하여 지속적인 사용자 설정 유지

### 📦 **실시간 파일 관리**
- **Firebase Firestore**와 `react-firebase-hooks/firestore`의 `useCollection`을 사용하여 실시간 파일 데이터 관리
- 파일 업로드 및 삭제 시 변경 사항이 즉시 반영되어 최신 데이터를 자동으로 확인 가능

### 📥 **직관적인 파일 업로드**
- **React Dropzone**을 사용해 직관적인 파일 드래그 앤 드롭 기능 구현
- `pretty-bytes`로 파일 크기를 직관적으로 표시하고, `react-file-icon`으로 파일 형식에 맞는 아이콘 렌더링

### ⚡ **성능 최적화**
- **서버 정렬:** Firebase Firestore의 `orderBy`를 사용하여 서버에서 데이터를 정렬
- **클라이언트 최적화:** `useMemo`를 활용해 정렬된 데이터를 효율적으로 관리하고 불필요한 연산 제거
- `useMemo`와 `useCallback`으로 데이터 연산과 이벤트 핸들러를 최적화하여 렌더링 성능 향상

### 🚀 **배포 및 호스팅**
- **Firebase Hosting**을 사용하여 안정적이고 빠른 성능 제공
- 글로벌 사용자에게 빠른 로드 속도와 높은 신뢰성 보장

## ⚙️ 기술 스택

### Frontend
- **React**
- **Recoil** (상태 관리)
- **React Dropzone** (파일 드래그 앤 드롭 기능)
- **React Toastify** (실시간 알림)

### Backend
- **Firebase Firestore** (실시간 데이터베이스)
- **Firebase Authentication** (사용자 인증 및 보안)

### Deployment
- **Firebase Hosting** (안정적인 배포 및 빠른 로딩 속도 제공)

---

더 나은 사용자 경험을 위해 최적화된 개인화된 파일 관리 시스템, **Drop In File**을 지금 경험해보세요!

