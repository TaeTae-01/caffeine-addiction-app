// API 요청 날리는거 중앙에서 처리하는 코드
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// API endpoint 정의
export const API_ENDPOINTS = {
    // 인증 관련
    AUTH: {
        REGISTER: `${API_BASE_URL}/api/auth/register`,
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        USERINFO: `${API_BASE_URL}/api/auth/user/info`,
        USEREDIT: `${API_BASE_URL}/api/auth/user/edit`,
        REFRESH: `${API_BASE_URL}/api/auth/refresh`,
        LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    }
    // 다른 API들 만들어지면 추가하기
};

// fetch 날리는 함수
// 파라미터로 endpoint와 option을 받아서 스프레드 연산자로 default에 파라미터 값을 바인딩 해서 최종적으로 api 요청을 날림
export const apiCall = async (endpoint, option = {}) => {
    // local storage에 토큰이 있는지 확인하기
  const token = localStorage.getItem('AccessToken');
    
    // 기본 옵션 (여기에 추가해서 최종적으로 api요청 보내기)
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // 토큰이 있으면 headers에 Authorization로 추가하기
    if (token) {
      defaultOptions.headers['Authorization'] = `Bearer ${token}`;
          console.log('Authorization 헤더 추가됨:', defaultOptions.headers['Authorization']);

    }

    // 옵션 병합하기 spread operator로 객체나 배열을 펼쳐서 병합(복사할 때도 사용)
    const finalOption = {
        ...defaultOptions,
        ...option,
        headers: {
            ...defaultOptions.headers,
            ...(option.headers || {})
        }
    };

    // 디버그 모드 true인 경우 console에 자세한 로그 찍어줌
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
        console.log('=== API 요청 시작 ===');
        console.log('요청 정보:');
        console.log('- URL:', endpoint);
        console.log('- Method:', finalOption.method);
        console.log('- Headers:', finalOption.headers);
        console.log('- Credentials:', finalOption.credentials);
        if (finalOption.body) {
            console.log('- Body:', finalOption.body);
        }
    }

    // api 요청 날리기
    try {
        const res = await fetch(endpoint, finalOption);

        // 디버그 모드 true인 경우 console에 자세한 로그 찍어줌
        if (import.meta.env.VITE_DEBUG_MODE === 'true') {
            console.log('=== API 응답 정보 ===');
            console.log('응답 상태 코드:', res.status);
            console.log('응답 상태 텍스트:', res.statusText);
            console.log('응답 헤더:', Object.fromEntries(res.headers.entries()));
        }
        return res;
    } catch (error) {
        if (import.meta.env.VITE_DEBUG_MODE === 'true') {
            console.log('=== API 네트워크 오류 ===');
            console.error('오류 타입:', error.name);
            console.error('오류 메시지:', error.message);
            console.error('전체 오류 객체:', error);
        }
        throw error;
    }
};

// JWT 토큰 파싱 유틸리티 (기존 Logout 코드에서 사용)
// 근데 아직 이해 잘 안되어서 공부해야할듯
export const parseJWTToken = (token) => {
  try {
    const tokenParts = token.split('.');
    const payload = JSON.parse(atob(tokenParts[1]));
    return {
      payload,
      isExpired: payload.exp < Math.floor(Date.now() / 1000),
      remainingTime: payload.exp - Math.floor(Date.now() / 1000),
      remainingMinutes: (payload.exp - Math.floor(Date.now() / 1000)) / 60
    };
  } catch (error) {
    console.error('토큰 파싱 오류:', error);
    return null;
  }
};

// 환경 정보 확인 함수
export const getEnvInfo = () => {
  if (import.meta.env.DEV) {
    return {
      mode: import.meta.env.MODE,
      apiBaseUrl: API_BASE_URL,
      debugMode: import.meta.env.VITE_DEBUG_MODE,
      appName: import.meta.env.VITE_APP_NAME,
    };
  }
  return null;
};
