# 비누뿌셔 🧼

비누를 선택하고 문질러 거품을 내는 힐링·ASMR 하이퍼캐주얼 웹게임

## 🎮 게임 소개

비누뿌셔는 다양한 비누와 도구를 선택하여 비누를 문지르고 거품을 만드는 힐링 게임입니다. 
ASMR 사운드와 시각적 효과로 스트레스 해소와 집중력 향상을 도와줍니다.

### 핵심 기능
- **다양한 비누**: 클래식 블루, 민트 프레시, 라벤더 드림, 시트러스 버스트
- **다양한 도구**: 손, 거품볼, 브러시 (각각 다른 압력과 속도)
- **실시간 거품 생성**: Canvas를 활용한 실시간 거품 렌더링
- **ASMR 사운드**: 문지르기 소리와 거품 팝 소리
- **햅틱 피드백**: 모바일 기기에서 진동 피드백
- **파티클 효과**: 거품 파티클 애니메이션

## 🚀 기술 스택

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Audio**: Web Audio API
- **PWA**: Vite PWA Plugin
- **Deployment**: Vercel (권장)

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 설치
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 개발 서버
개발 서버는 `http://localhost:3000`에서 실행됩니다.

## 🎯 게임 플레이

1. **비누 선택**: 4가지 비누 중 하나를 선택
2. **도구 선택**: 손, 거품볼, 브러시 중 하나를 선택
3. **문지르기**: 화면을 터치하거나 마우스로 드래그하여 비누를 문지름
4. **거품 생성**: 문지른 영역에 거품이 생성되고 진행도가 증가
5. **완성**: 100% 진행도 달성 시 완료 메시지 표시

## 🎨 커스터마이징

### 새로운 비누 추가
`src/store.ts`의 `availableSoaps` 배열에 새로운 비누를 추가할 수 있습니다:

```typescript
{
  id: 'new-soap',
  name: '새로운 비누',
  color: '#FF6B6B',
  texture: 'smooth',
  foamMultiplier: 1.3,
  shine: 0.7,
  particles: 80,
  price: 150,
  unlocked: false
}
```

### 새로운 도구 추가
`src/store.ts`의 `availableTools` 배열에 새로운 도구를 추가할 수 있습니다:

```typescript
{
  id: 'new-tool',
  name: '새로운 도구',
  icon: '🪥',
  pressure: 1.8,
  speed: 0.7
}
```

## 📱 PWA 기능

- **오프라인 지원**: Service Worker를 통한 캐싱
- **홈 화면 추가**: 모바일에서 앱처럼 설치 가능
- **푸시 알림**: (향후 구현 예정)

## 🎵 오디오 시스템

- **스크럽 사운드**: 문지르기 속도와 압력에 따른 동적 사운드
- **팝 사운드**: 거품 완성 시 재생
- **Web Audio API**: 실시간 오디오 처리

## 🔧 성능 최적화

- **Canvas 최적화**: 오프스크린 캔버스 사용
- **파티클 제한**: 최대 200개 파티클로 성능 보장
- **DPR 제한**: 최대 2배 해상도로 렌더링 최적화
- **저사양 모드**: 파티클 수 제한 옵션

## 📊 분석 (선택사항)

게임 분석을 위해 Umami 또는 PostHog를 추가할 수 있습니다:

```typescript
// 분석 이벤트 예시
track('scrub_start', { soap: selectedSoap.id, tool: selectedTool.id })
track('scrub_complete', { duration: gameTime, progress: 100 })
```

## 🚀 배포

### Vercel 배포 (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 수동 배포
```bash
# 빌드
npm run build

# dist 폴더를 웹 서버에 업로드
```

## 🎯 마일스톤

- [x] **M1**: 비누 선택 + 문지르기 + 진행도 + 파티클
- [x] **M2**: SFX 붙이기 (스크럽/팝)
- [x] **M3**: 비누 특성치 파라미터화
- [ ] **M4**: 미션/타이머 + 결과 화면
- [ ] **M5**: PWA 설치 & Vercel 배포

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 연락처

프로젝트 링크: [https://github.com/yourusername/soap-bbusyeo](https://github.com/yourusername/soap-bbusyeo)

---

**비누뿌셔**로 스트레스 없는 힐링 시간을 보내세요! 🧼✨

