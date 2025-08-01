import { useEffect, useState, useCallback } from 'react'
import useLoading from './useLoading';
import { STORAGE_KEYS, HTTP_STATUS, ERROR_MESSAGES } from '../config/constants'
import { API_ENDPOINTS, apiCall, parseJWTToken } from '../config/api';

function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, startLoading] = useLoading(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    // 🔄 초기화: 새로고침 시 토큰 복원 및 사용자 정보 자동 로드
    useEffect(() => {
        const initializeAuth = async () => {
            console.log('[INIT] 인증 초기화 시작');
            
            try {
                const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
                
                if (!token) {
                    console.log('[INIT] 토큰 없음 - 로그아웃 상태 유지');
                    return;
                }
                
                // 🔍 토큰 유효성 검사
                const tokenInfo = parseJWTToken(token);
                if (!tokenInfo) {
                    console.log('[INIT] 토큰 파싱 실패 - 토큰 삭제');
                    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                    return;
                }
                
                // 🕐 토큰 만료 확인
                if (tokenInfo.isExpired) {
                    console.log('[INIT] 토큰 만료 - 리프레시 시도');
                    const refreshResult = await refreshToken();
                    
                    if (!refreshResult.success) {
                        console.log('[INIT] 리프레시 실패 - 로그아웃 상태');
                        return;
                    }
                }
                
                // 👤 사용자 정보 자동 로드
                console.log('[INIT] 사용자 정보 자동 로드 시도');
                await getUserInfo();
                
                console.log('[INIT] 인증 초기화 완료');
                
            } catch (error) {
                console.error('[INIT] 초기화 중 오류:', error);
                // 오류 발생 시 안전하게 로그아웃 상태로
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                setUser(null);
                setIsAuthenticated(false);
            }
        };
        
        initializeAuth();
    }, [refreshToken, getUserInfo]);

    // 🔄 리프레시 토큰 API 호출 함수
    const fetchRefreshToken = useCallback(() => {
        return apiCall(API_ENDPOINTS.AUTH.REFRESH, {
            method: 'POST',
            credentials: 'include', // 🍪 httpOnly 쿠키 전송을 위해 필수
        });
    }, []);

    const fetchLogin = useCallback((credential) => {
        return apiCall(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(credential)
        });
    }, []);

      // 📝 로그인 함수: credentials 객체를 받아서 로그인 처리
      const login = useCallback(async (credentials) => {
        // credentials는 { email, password } 형태로 받음
        const { email, password } = credentials;

        // API 요청을 위한 payload 구성
        const payload = {
          email: email,
          password: password
        };
          
          try {
            const res = await startLoading(fetchLogin(payload));
            
            const data = await res.json();
            
            if (res.status === HTTP_STATUS.OK) {
              
              if (data.token) {
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.token);
                console.log('[LOGIN] 토큰 저장 완료');
                
                setIsAuthenticated(true);
                
                if (data.user) {
                  setUser(data.user);
                  console.log('[LOGIN] 사용자 정보 저장:', data.user);
                }
                
                console.log('[LOGIN] 로그인 성공');
                return { success: true, data };
                
              } else {
                console.log('[LOGIN] 경고: 응답에 토큰이 없음');
                throw new Error('서버 응답에 토큰이 없습니다.');
              }
            }
            // ❌ HTTP 에러 상태별 처리
            else if (res.status === HTTP_STATUS.UNAUTHORIZED) {
              alert(`이메일/비밀번호를 다시 입력해주세요`)
              throw new Error(ERROR_MESSAGES.LOGIN_FAILED);
            }
            else if (res.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
              alert(`서버 오류가 발생했습니다.
                ${ERROR_MESSAGES.SERVER}`)
              throw new Error(ERROR_MESSAGES.SERVER);
            }
            else {
              alert(`알 수 없는 오류가 발생했습니다.
                ${res.status}`);
              throw new Error(data.message || '알 수 없는 오류가 발생했습니다.');
            }
          } catch (error) {
            alert(`로그인 실패: ${error}`);
            throw error;
          } 
      }, [startLoading, fetchLogin]);
         // 🚪 로그아웃 API 호출 함수
  const fetchLogout = useCallback(() => {
    return apiCall(API_ENDPOINTS.AUTH.LOGOUT, {
    \n            method: 'POST', \n            credentials: 'include', // 🍪 RefreshToken 쿠키 전송을 위해 필수\n        });\n    }, []);\n\n    // 🚪 로그아웃 메인 함수\n    const logout = useCallback(async () => {\n        console.log('[LOGOUT] 로그아웃 시작');\n        \n        try {\n            // 🚀 서버에 로그아웃 요청\n            const res = await startLoading(fetchLogout());\n            const data = await res.json();\n            \n            console.log('[LOGOUT] 서버 응답:', data);\n            \n            // ✅ 성공 여부와 관계없이 로컬 상태 초기화\n            if (res.status === HTTP_STATUS.OK) {\n                console.log('[LOGOUT] 서버 로그아웃 성공');\n            } else {\n                console.warn('[LOGOUT] 서버 로그아웃 실패, 로컬 정리만 진행:', res.status);\n            }\n            \n        } catch (error) {\n            console.error('[LOGOUT] 로그아웃 API 호출 실패:', error);\n            // 🚨 서버 오류여도 로컬 상태는 정리\n        } finally {\n            // 🧹 항상 로컬 상태 정리 (서버 실패와 무관하게)\n            console.log('[LOGOUT] 로컬 상태 정리 시작');\n            \n            // 🗑️ localStorage에서 AccessToken 삭제\n            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);\n            \n            // 🔄 React 상태 초기화\n            setUser(null);\n            setIsAuthenticated(false);\n            \n            console.log('[LOGOUT] 로그아웃 완료');\n            \n            // 📢 사용자에게 알림 (선택적)\n            // alert('로그아웃되었습니다.');\n        }\n        \n        return { success: true };\n    }, [startLoading, fetchLogout]);\n\n    // 📝 회원가입 API 호출 함수\n    const fetchRegister = useCallback((userData) => {\n        return apiCall(API_ENDPOINTS.AUTH.REGISTER, {\n            method: 'POST',\n            credentials: 'include',\n            body: JSON.stringify(userData)\n        });\n    }, []);\n\n    // 📝 회원가입 메인 함수\n    const register = useCallback(async (userData) => {\n        console.log('[REGISTER] 회원가입 시작:', userData.email);\n        \n        try {\n            // 🚀 회원가입 API 호출\n            const res = await startLoading(fetchRegister(userData));\n            const data = await res.json();\n            \n            console.log('[REGISTER] 서버 응답:', data);\n            \n            // ✅ 성공\n            if (res.status === HTTP_STATUS.OK) {\n                console.log('[REGISTER] 회원가입 성공');\n                \n                // 🔄 선택적 자동 로그인 (서버에서 토큰을 주지 않으므로 수동 로그인 필요)\n                // 실제로는 사용자에게 로그인하라고 안내\n                return { \n                    success: true, \n                    message: '회원가입이 완료되었습니다. 로그인해주세요.',\n                    data \n                };\n            }\n            // ❌ 409 - 이메일 중복\n            else if (res.status === HTTP_STATUS.CONFLICT) {\n                console.log('[REGISTER] 이메일 중복');\n                throw new Error('이미 사용 중인 이메일입니다.');\n            }\n            // ❌ 400 - 유효성 검사 실패\n            else if (res.status === HTTP_STATUS.BAD_REQUEST) {\n                console.log('[REGISTER] 유효성 검사 실패');\n                throw new Error('입력 정보를 확인해주세요.');\n            }\n            else {\n                console.error('[REGISTER] 알 수 없는 오류:', res.status);\n                throw new Error(data.message || '회원가입 중 오류가 발생했습니다.');\n            }\n            \n        } catch (error) {\n            console.error('[REGISTER] 회원가입 실패:', error);\n            throw error;\n        }\n    }, [startLoading, fetchRegister]);\n\n    // 👤 사용자 정보 조회 메인 함수  \n    const getUserInfo = useCallback(async () => {\n        console.log('[USER_INFO] 사용자 정보 조회 시작');\n        \n        try {\n            // 🛡️ 인증이 필요한 API이므로 apiCallWithAuth 사용\n            const res = await apiCallWithAuth(API_ENDPOINTS.AUTH.USERINFO, {\n                method: 'GET'\n            });\n            \n            const data = await res.json();\n            console.log('[USER_INFO] 서버 응답:', data);\n            \n            // ✅ 성공\n            if (res.status === HTTP_STATUS.OK) {\n                console.log('[USER_INFO] 사용자 정보 조회 성공');\n                \n                // 👤 사용자 정보 상태 업데이트\n                if (data.user || data.email) {\n                    const userInfo = data.user || { \n                        email: data.email, \n                        name: data.name,\n                        // 기타 사용자 정보 필드들\n                    };\n                    setUser(userInfo);\n                    setIsAuthenticated(true);\n                    console.log('[USER_INFO] 사용자 정보 상태 업데이트 완료');\n                }\n                \n                return { success: true, user: data.user || data };\n            }\n            // ❌ 401/403 - 인증 실패 (apiCallWithAuth에서 이미 처리되지만 추가 안전장치)\n            else if (res.status === HTTP_STATUS.UNAUTHORIZED || res.status === HTTP_STATUS.FORBIDDEN) {\n                console.log('[USER_INFO] 인증 실패 - 로그아웃 처리');\n                await handleTokenExpiredLogout();\n                throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');\n            }\n            else {\n                console.error('[USER_INFO] 알 수 없는 오류:', res.status);\n                throw new Error(data.message || '사용자 정보 조회 중 오류가 발생했습니다.');\n            }\n            \n        } catch (error) {\n            console.error('[USER_INFO] 사용자 정보 조회 실패:', error);\n            // 인증 오류가 아닌 경우는 에러를 다시 던지기\n            if (!error.message.includes('인증')) {\n                throw error;\n            }\n        }\n    }, [apiCallWithAuth, handleTokenExpiredLogout]);\n\n    // ✏️ 사용자 정보 수정 함수\n    const updateUserInfo = useCallback(async (userData) => {\n        console.log('[UPDATE_USER] 사용자 정보 수정 시작');\n        \n        try {\n            const res = await apiCallWithAuth(API_ENDPOINTS.AUTH.USEREDIT, {\n                method: 'PATCH',\n                body: JSON.stringify(userData)\n            });\n            \n            const data = await res.json();\n            console.log('[UPDATE_USER] 서버 응답:', data);\n            \n            if (res.status === HTTP_STATUS.OK) {\n                console.log('[UPDATE_USER] 사용자 정보 수정 성공');\n                \n                // 🔄 로컬 사용자 정보 동기화\n                if (data.user || data.email) {\n                    const updatedUser = { ...user, ...userData };\n                    setUser(updatedUser);\n                    console.log('[UPDATE_USER] 로컬 사용자 정보 동기화 완료');\n                }\n                \n                return { success: true, user: data.user || data };\n            } else {\n                throw new Error(data.message || '사용자 정보 수정 중 오류가 발생했습니다.');\n            }\n            \n        } catch (error) {\n            console.error('[UPDATE_USER] 사용자 정보 수정 실패:', error);\n            throw error;\n        }\n    }, [apiCallWithAuth, user]);\n\n    // 🔄 토큰 만료 감지 유틸 함수\n    const isTokenExpired = useCallback(() => {\n        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);\n        if (!token) return true;\n        \n        const tokenInfo = parseJWTToken(token);\n        if (!tokenInfo) return true;\n        \n        // 📅 만료 5분 전부터 갱신 준비 (선택적)\n        const bufferTime = 5 * 60; // 5분\n        return tokenInfo.remainingTime <= bufferTime;\n    }, []);\n\n    // 🔄 리프레시 토큰 메인 함수\n    const refreshToken = useCallback(async () => {\n        console.log('[REFRESH] 토큰 갱신 시작');\n        \n        try {\n            // 🚀 리프레시 API 호출 (httpOnly 쿠키 자동 전송)\n            const res = await startLoading(fetchRefreshToken());\n            const data = await res.json();\n            \n            console.log('[REFRESH] 서버 응답:', data);\n            \n            // ✅ 성공 - 새로운 AccessToken 저장\n            if (res.status === HTTP_STATUS.OK && data.newToken) {\n                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.newToken);\n                console.log('[REFRESH] 새 토큰 저장 완료');\n                \n                // 🔐 인증 상태 유지\n                setIsAuthenticated(true);\n                \n                return { success: true, newToken: data.newToken };\n            }\n            // ❌ 403 - RefreshToken 만료 → 자동 로그아웃\n            else if (res.status === HTTP_STATUS.FORBIDDEN) {\n                console.log('[REFRESH] RefreshToken 만료 - 로그아웃 처리');\n                await handleTokenExpiredLogout();\n                return { success: false, error: 'REFRESH_TOKEN_EXPIRED' };\n            }\n            // ❌ 401 - RefreshToken 만료 → 자동 로그아웃\n            else if (res.status === HTTP_STATUS.UNAUTHORIZED) {\n                console.log('[REFRESH] RefreshToken 만료 - 로그아웃 처리');\n                await handleTokenExpiredLogout();\n                return { success: false, error: 'REFRESH_TOKEN_EXPIRED' };\n            }\n            else {\n                console.error('[REFRESH] 알 수 없는 오류:', res.status);\n                throw new Error(data.message || '토큰 갱신 중 오류 발생');\n            }\n            \n        } catch (error) {\n            console.error('[REFRESH] 토큰 갱신 실패:', error);\n            // 🚨 네트워크 오류 등으로 실패 시에도 로그아웃 처리\n            await handleTokenExpiredLogout();\n            return { success: false, error: error.message };\n        }\n    }, [startLoading, fetchRefreshToken]);\n\n    // 🚪 토큰 만료로 인한 자동 로그아웃 처리\n    const handleTokenExpiredLogout = useCallback(async () => {\n        console.log('[AUTH] 토큰 만료로 인한 자동 로그아웃');\n        \n        // 🗑️ 로컬 스토리지 정리\n        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);\n        \n        // 🔄 상태 초기화\n        setUser(null);\n        setIsAuthenticated(false);\n        \n        // 📢 사용자 친화적 알림\n        if (window.confirm('세션이 만료되었습니다. 다시 로그인하시겠습니까?')) {\n            // 로그인 페이지로 리디렉션 로직 (필요시)\n            // window.location.href = '/login';\n        }\n        \n    }, []);\n\n    // 🛡️ API 호출 시 토큰 자동 처리 래퍼 함수\n    const apiCallWithAuth = useCallback(async (endpoint, options = {}) => {\n        console.log('[API_AUTH] API 호출 시작:', endpoint);\n        \n        // 🔍 API 호출 전 토큰 사전 체크 (선택적)\n        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);\n        if (!token) {\n            console.log('[API_AUTH] 토큰이 없음 - 로그인 필요');\n            throw new Error('로그인이 필요합니다.');\n        }\n        \n        // 📅 토큰 만료 확인 및 사전 갱신 (선택적)\n        if (isTokenExpired()) {\n            console.log('[API_AUTH] 토큰 만료 임박 - 사전 갱신');\n            const refreshResult = await refreshToken();\n            if (!refreshResult.success) {\n                throw new Error('토큰 갱신 실패');\n            }\n        }\n        \n        try {\n            // 🚀 첫 번째 API 호출 시도\n            let response = await apiCall(endpoint, {\n                credentials: 'include', // 🍪 httpOnly 쿠키 전송\n                ...options\n            });\n            \n            // ✅ 성공하면 바로 반환\n            if (response.status !== HTTP_STATUS.UNAUTHORIZED) {\n                return response;\n            }\n            \n            // 🔄 401 에러 시 토큰 갱신 후 재시도\n            console.log('[API_AUTH] 401 에러 감지 - 토큰 갱신 후 재시도');\n            \n            const refreshResult = await refreshToken();\n            if (!refreshResult.success) {\n                console.error('[API_AUTH] 토큰 갱신 실패 - API 호출 중단');\n                throw new Error('인증 만료 - 다시 로그인해주세요.');\n            }\n            \n            // 🔄 갱신된 토큰으로 재시도\n            console.log('[API_AUTH] 갱신된 토큰으로 API 재호출');\n            response = await apiCall(endpoint, {\n                credentials: 'include',\n                ...options\n            });\n            \n            return response;\n            \n        } catch (error) {\n            console.error('[API_AUTH] API 호출 실패:', error);\n            throw error;\n        }\n    }, [isTokenExpired, refreshToken]);

    // 📤 훅에서 제공하는 모든 상태와 함수들
    return {
        // 🔐 상태
        user,
        loading,
        isAuthenticated,
        
        // 🚀 인증 관련 함수들
        login,\n        logout,\n        register,\n        getUserInfo,\n        updateUserInfo,
        
        // 🔄 토큰 관리 함수들
        refreshToken,
        isTokenExpired,
        
        // 🛡️ API 호출 래퍼
        apiCallWithAuth,
        
        // 🚪 로그아웃 관련
        handleTokenExpiredLogout,
    };
}

export default useAuth;

