기술 스펙/스텍 정리

# CaffeineTracker Web - 기술 스펙 정리

## 1. 기술 스택 개요

### 1.1 Frontend Core

- **React 18.2+**: 함수형 컴포넌트와 Hooks 기반 개발
- **JavaScript (ES6+)**: TypeScript 대신 순수 JavaScript 사용
- **Vite**: 빠른 개발 환경과 최적화된 프로덕션 빌드

### 1.2 상태 관리

- **Context API**: 전역 상태 관리 (테마, 사용자 정보)
- **React Query (TanStack Query)**: 서버 상태 관리 및 캐싱
- **LocalStorage**: 클라이언트 데이터 영속성

### 1.3 스타일링

- **Tailwind CSS 3.4+**: 유틸리티 퍼스트 CSS 프레임워크
- **CSS Modules**: 컴포넌트별 스타일 격리
- **Framer Motion**: 애니메이션 라이브러리

### 1.4 라우팅

- **React Router v6**: SPA 라우팅 관리
- **Protected Routes**: 인증 기반 라우트 보호

### 1.5 UI/UX 라이브러리

- **Heroicons**: 아이콘 라이브러리
- **Recharts**: 데이터 시각화 차트
- **React Hot Toast**: 토스트 알림
- **HeadlessUI**: 접근성을 고려한 UI 컴포넌트

### 1.6 개발 도구

- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Husky**: Git hooks 관리
- **Commitlint**: 커밋 메시지 규칙

## 2. 프로젝트 구조

```
caffeine-tracker-web/
├── public/
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   ├── caffeine/
│   │   ├── layout/
│   │   └── ui/
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── CaffeineContext.jsx
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useCaffeine.js
│   │   └── useTheme.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   ├── History.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   ├── caffeine.js
│   │   └── storage.js
│   ├── utils/
│   │   ├── calculations.js
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 3. 핵심 기능 구현 스펙

### 3.1 카페인 추적 시스템

```javascript
// 카페인 반감기 계산 알고리즘
const CAFFEINE_HALF_LIFE = 5.5; // hours

function calculateRemainingCaffeine(initialAmount, hoursElapsed) {
  return initialAmount * Math.pow(0.5, hoursElapsed / CAFFEINE_HALF_LIFE);
}

// 실시간 업데이트 (1분마다)
useEffect(() => {
  const interval = setInterval(() => {
    updateCaffeineLevel();
  }, 60000);

  return () => clearInterval(interval);
}, []);
```

### 3.2 LocalStorage 데이터 구조

```javascript
// 사용자 프로필
const userProfile = {
  id: 'uuid',
  name: '홍길동',
  email: 'user@example.com',
  age: 30,
  weight: 70, // kg
  gender: 'male', // male, female, other
  dailyLimit: 400, // mg
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

// 카페인 로그
const caffeineLog = {
  id: 'uuid',
  timestamp: '2024-01-01T09:00:00Z',
  category: 'coffee',
  brand: '스타벅스',
  item: '아이스 아메리카노',
  size: 'Tall',
  caffeineAmount: 150, // mg
  remainingAmount: 75, // mg (현재 시점)
};

// 테마 설정
const themeSettings = {
  mode: 'system', // light, dark, system
  primaryColor: '#8B5CF6',
};
```

### 3.3 카페인 아이템 데이터베이스

```javascript
export const CAFFEINE_DATABASE = {
  coffee: {
    스타벅스: {
      items: [
        {
          name: '아이스 아메리카노',
          sizes: {
            Tall: { volume: 355, caffeine: 150 },
            Grande: { volume: 473, caffeine: 225 },
            Venti: { volume: 591, caffeine: 300 },
          },
        },
        {
          name: '카페라떼',
          sizes: {
            Tall: { volume: 355, caffeine: 75 },
            Grande: { volume: 473, caffeine: 150 },
            Venti: { volume: 591, caffeine: 225 },
          },
        },
      ],
    },
    // ... 다른 브랜드
  },
  energyDrink: {
    몬스터: {
      items: [
        { name: '몬스터 오리지널', volume: 355, caffeine: 160 },
        { name: '몬스터 화이트', volume: 355, caffeine: 140 },
        { name: '몬스터 울트라', volume: 355, caffeine: 140 },
      ],
    },
    // ... 다른 브랜드
  },
};
```

## 4. 성능 최적화 전략

### 4.1 코드 스플리팅

```javascript
// 라우트 기반 코드 스플리팅
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const History = lazy(() => import('./pages/History'));
```

### 4.2 메모이제이션

```javascript
// 복잡한 계산 최적화
const dailyStats = useMemo(() => {
  return calculateDailyStats(caffeineLog);
}, [caffeineLog]);

// 컴포넌트 리렌더링 방지
const CaffeineItem = memo(({ item, onSelect }) => {
  // ...
});
```

### 4.3 이미지 최적화

- WebP 포맷 사용
- Lazy loading 적용
- 적절한 이미지 크기 제공

## 5. PWA 설정

### 5.1 Service Worker

```javascript
// 오프라인 지원
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### 5.2 Manifest.json

```json
{
  "name": "CaffeineTracker",
  "short_name": "Caffeine",
  "description": "카페인 섭취 추적 앱",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#8B5CF6",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 6. 테마 시스템

### 6.1 CSS 변수

```css
:root {
  --color-primary: #8b5cf6;
  --color-background: #ffffff;
  --color-text: #1f2937;
  --color-border: #e5e7eb;
}

[data-theme='dark'] {
  --color-primary: #a78bfa;
  --color-background: #111827;
  --color-text: #f9fafb;
  --color-border: #4b5563;
}
```

### 6.2 Tailwind 설정

```javascript
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5F3FF',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        caffeine: {
          light: '#8B4513',
          dark: '#D2691E',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
};
```

## 7. 접근성 (a11y)

### 7.1 WCAG 2.1 준수

- 색상 대비율 4.5:1 이상
- 키보드 네비게이션 완벽 지원
- 스크린 리더 호환성

### 7.2 ARIA 레이블

```jsx
<button aria-label="카페인 추가" aria-pressed={isSelected} role="button">
  <span aria-hidden="true">+</span>
  추가하기
</button>
```

## 8. 보안 고려사항

### 8.1 데이터 보호

- LocalStorage 데이터 암호화 (선택적)
- XSS 방지를 위한 입력값 검증
- CSP(Content Security Policy) 헤더 설정

### 8.2 프라이버시

- 개인정보는 로컬에만 저장
- 외부 추적 스크립트 미사용
- 데이터 내보내기 시 민감정보 마스킹

## 9. 브라우저 지원

### 9.1 최소 요구사항

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 9.2 Progressive Enhancement

- 기본 기능은 모든 브라우저에서 작동
- 고급 기능은 지원 브라우저에서만 활성화

## 10. 개발 환경 설정

### 10.1 필수 도구

- Node.js 18+
- npm 또는 yarn
- Git

### 10.2 환경 변수

```bash
# .env.example
VITE_APP_NAME=CaffeineTracker
VITE_APP_VERSION=1.0.0
VITE_APP_API_URL=http://localhost:3000
VITE_APP_ENABLE_PWA=true
```

### 10.3 개발 서버 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 프리뷰
npm run preview
```
