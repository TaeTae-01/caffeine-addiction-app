// app 전역 상수들
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Caffeine Addiction App',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  ENV: import.meta.env.MODE,
};

// 로컬 스토리지 키들 (기존 코드에서 사용 중인 키 이름)
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'AccessToken', // 기존 코드에서 사용 중인 키 이름
    SETTINGS: 'appSettings',
  // local storage에 data들 추가되면 여기에 키 추가하기
};

// API 관련 상수
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  CREDENTIALS: 'include', // 기존 코드에서 사용 중인 쿠키 처리
};

// 폼 검증 규칙
export const VALIDATION_RULES = {
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: '올바른 이메일 형식을 입력해주세요.',
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MESSAGE: '비밀번호는 6자 이상이어야 합니다.',
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 20,
    REGEX: /^[가-힣a-zA-Z]+$/,
    MESSAGE: '이름은 한글 또는 영문 2 ~ 20자로 입력해주세요.',
  },
};

// 에러 메시지
export const ERROR_MESSAGES = {
  NETWORK: '네트워크 연결을 확인해주세요.',
  SERVER: '서버 오류가 발생했습니다.',
  VALIDATION: '입력값을 확인해주세요.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  TOKEN_EXPIRED: '토큰이 만료되었습니다. 다시 로그인해주세요.',
  INVALID_TOKEN: '토큰이 유효하지 않습니다. 다시 로그인해주세요.',
  DUPLICATE_EMAIL: '이미 사용 중인 이메일입니다.',
  LOGIN_FAILED: '로그인에 실패했습니다.',
  LOGOUT_FAILED: '로그아웃 중 오류가 발생했습니다.',
  TOKEN_REFRESH_FAILED: '토큰 갱신에 실패했습니다.',
};

// HTTP 상태 코드 매핑
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// 서버 응답 상태 코드 매핑 (API 문서 기반)
export const SERVER_STATUS = {
  SUCCESS: 'SU',
  VALIDATION_FAILED: 'VF',
  LOGIN_FAILED: 'LF',
  EXPIRED_REFRESH_TOKEN: 'ERT',
  INVALID_TOKEN: 'IT',
  INVALID_REFRESH_TOKEN: 'IRT',
  DUPLICATE_EMAIL: 'DE',
  DATABASE_ERROR: 'DBE',
};
