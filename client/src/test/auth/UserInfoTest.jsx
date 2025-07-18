import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { parseJWTToken } from '../../config/api'
import { API_ENDPOINTS, apiCall } from '../../config/api'
import useLoading from '../../hooks/useLoading'
import { HTTP_STATUS, ERROR_MESSAGES } from '../../config/constants'

function UserInfoTest() {
  // 기존 UserInfo 상태
  const [isLoading, startLoading] = useLoading()
  const [userId, setUserId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [userWeight, setUserWeight] = useState('')
  const [userCaffeineLimit, setUserCaffeineLimit] = useState('')
  const [userPasswordConfirm, setUserPasswordConfirm] = useState('')
  
  // 최초 사용자 데이터 저장용 (수정 비교용 캐시)
  const originalUserDataRef = useRef({})
  
  // TokenTest에서 가져온 상태들
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('AccessToken'))
  const [tokenInfo, setTokenInfo] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false)
  const intervalRef = useRef(null)
  
  // 토큰 정보 파싱 및 시간 계산
  const updateTokenInfo = useCallback(() => {
    const token = localStorage.getItem('AccessToken')
    if (token) {
      const parsed = parseJWTToken(token)
      setTokenInfo(parsed)
      setTimeLeft(parsed ? parsed.remainingTime : 0)
    } else {
      setTokenInfo(null)
      setTimeLeft(0)
    }
  }, [])

  // 사용자 정보 상태를 필요한 부분만 업데이트하는 함수
  const updateUserState = useCallback((userData) => {
    if (userData.id !== userId) setUserId(userData.id);
    if (userData.email !== userEmail) setUserEmail(userData.email);
    if (userData.name !== userName) setUserName(userData.name);
    if (userData.weight !== userWeight) setUserWeight(userData.weight);
    if (userData.dailyCaffeineLimit !== userCaffeineLimit)
      setUserCaffeineLimit(userData.dailyCaffeineLimit);
    
    // password는 평소에는 저장하지 않으므로 빈 문자열로 유지
    setUserPassword('');

    // 원본 정보 저장
    originalUserDataRef.current = userData;
  }, [userId, userEmail, userName, userWeight, userCaffeineLimit]);

  // 사용자 정보 불러오기 로컬 스토리지 체크 -> 없으면 api 요청 날림 (캐시 활용)
  const getUserInfo = useCallback(async () => {
    console.log('[USERINFO] === 사용자 정보 조회 시작 ===')
    console.log('[USERINFO] 현재 시간:', new Date().toISOString())
    
    try {
      const cached = localStorage.getItem('cachedUserInfo');
      console.log('[USERINFO] 캐시된 사용자 정보 확인:', cached ? '존재' : '없음')
      
      if (cached) {
        console.log('[USERINFO] 캐시된 데이터 사용')
        const cachedData = JSON.parse(cached)
        console.log('[USERINFO] 캐시된 데이터:', cachedData)
        console.log('[USERINFO] 캐시된 데이터 키들:', Object.keys(cachedData))
        updateUserState(cachedData)
        console.log('[USERINFO] 캐시된 데이터로 상태 업데이트 완료')
        return;
      }

      console.log('[USERINFO] 캐시 없음, API 요청 시작')
      console.log('[USERINFO] API 엔드포인트:', API_ENDPOINTS.AUTH.USERINFO)
      console.log('[USERINFO] 요청 메서드: GET')
      const requestStartTime = Date.now()

      const res = await startLoading(
        apiCall(API_ENDPOINTS.AUTH.USERINFO, { method: 'GET' })
      );

      const requestEndTime = Date.now()
      const requestDuration = requestEndTime - requestStartTime
      
      console.log('[USERINFO] API 요청 완료')
      console.log('[USERINFO] 요청 소요 시간:', requestDuration + 'ms')
      console.log('[USERINFO] 응답 상태 코드:', res.status)

      if (res.status === HTTP_STATUS.OK) {
        const data = await res.json();
        console.log('[USERINFO] === 사용자 정보 조회 성공 ===')
        console.log('[USERINFO] 응답 데이터:', data)
        console.log('[USERINFO] 사용자 정보:', data.user)
        console.log('[USERINFO] 사용자 정보 키들:', Object.keys(data.user || {}))
        
        localStorage.setItem('cachedUserInfo', JSON.stringify(data.user));
        console.log('[USERINFO] 사용자 정보 캐시 저장 완료')
        updateUserState(data.user);
        console.log('[USERINFO] 상태 업데이트 완료')
      } else {
        console.error('[USERINFO] 사용자 정보 요청 실패:', res.status)
        const errorData = await res.json().catch(() => null)
        console.error('[USERINFO] 오류 응답 데이터:', errorData)
        alert('사용자 정보를 불러오는데 실패했습니다.')
      }
    } catch (error) {
      console.error('[USERINFO] === 사용자 정보 요청 오류 ===')
      console.error('[USERINFO] 오류 타입:', error.name)
      console.error('[USERINFO] 오류 메시지:', error.message)
      console.error('[USERINFO] 오류 스택:', error.stack)
      console.error('[USERINFO] 전체 오류 객체:', error)
      alert('사용자 정보 요청 중 오류가 발생했습니다.')
    } finally {
      console.log('[USERINFO] === 사용자 정보 조회 프로세스 종료 ===')
    }
  }, [startLoading, updateUserState]);

  // 사용자 정보가 변경될 경우에만 버튼 누를 수 있게 (useMemo로 계산 최적화)  
const hasChanges = useMemo(() => {
  const original = originalUserDataRef.current;
  return (
    userEmail !== original.email ||
    userName !== original.name ||
    userWeight !== original.weight ||
    userCaffeineLimit !== original.dailyCaffeineLimit ||
    (userPassword && userPassword === userPasswordConfirm)
  );
}, [userEmail, userName, userWeight, userCaffeineLimit, userPassword, userPasswordConfirm]);

  // 사용자 정보 수정 (모든 값을 payload에 담는 것이 아니라 변경된 값만 요청)
  const editUserInfo = useCallback(async () => {
    console.log('[USERINFO] === 사용자 정보 수정 시작 ===')
    console.log('[USERINFO] 현재 시간:', new Date().toISOString())
    
    const original = originalUserDataRef.current;
    const updatedPayload = {};
    
    console.log('[USERINFO] 원본 데이터:', original)
    console.log('[USERINFO] 현재 상태값 확인:')
    console.log('[USERINFO] - 현재 이메일:', userEmail)
    console.log('[USERINFO] - 현재 비밀번호 입력:', userPassword ? '입력됨' : '비어있음')
    console.log('[USERINFO] - 현재 비밀번호 확인:', userPasswordConfirm ? '입력됨' : '비어있음')
    console.log('[USERINFO] - 현재 이름:', userName)
    console.log('[USERINFO] - 현재 몸무게:', userWeight)
    console.log('[USERINFO] - 현재 카페인 제한:', userCaffeineLimit)
    
    // 간단한 비밀번호 검증 로직
    if (userPassword && userPassword !== userPasswordConfirm) {
      console.log('[USERINFO] 비밀번호 불일치 오류')
      console.log('[USERINFO] - 비밀번호 길이:', userPassword.length)
      console.log('[USERINFO] - 비밀번호 확인 길이:', userPasswordConfirm.length)
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
  
    // 변경된 값만 페이로드에 포함
    if (userEmail !== original.email) {
      updatedPayload.email = userEmail;
      console.log('[USERINFO] 이메일 변경 감지:', original.email, '->', userEmail)
    }
    if (userPassword) {
      updatedPayload.password = userPassword;
      console.log('[USERINFO] 비밀번호 변경 감지 (길이:', userPassword.length, '자)')
    }
    if (userName !== original.name) {
      updatedPayload.name = userName;
      console.log('[USERINFO] 이름 변경 감지:', original.name, '->', userName)
    }
    if (userWeight !== original.weight) {
      updatedPayload.weight = userWeight;
      console.log('[USERINFO] 몸무게 변경 감지:', original.weight, '->', userWeight)
    }
    if (userCaffeineLimit !== original.dailyCaffeineLimit) {
      updatedPayload.dailyCaffeineLimit = userCaffeineLimit;
      console.log('[USERINFO] 카페인 제한 변경 감지:', original.dailyCaffeineLimit, '->', userCaffeineLimit)
    }
    
    console.log('[USERINFO] 최종 페이로드:', updatedPayload)
    console.log('[USERINFO] 페이로드 키 개수:', Object.keys(updatedPayload).length)
    
    // 만약에 변경된 내용이 없으면 종료 -> TODO: button을 disable로 놓아도 괜찮을 것 같다. 
    if (Object.keys(updatedPayload).length === 0) {
      console.log('[USERINFO] 변경된 내용이 없어서 요청 취소')
      return;
    }
  
    try {
      console.log('[USERINFO] API 요청 시작')
      console.log('[USERINFO] API 엔드포인트:', API_ENDPOINTS.AUTH.USEREDIT)
      console.log('[USERINFO] 요청 메서드: PATCH')
      console.log('[USERINFO] 페이로드 JSON:', JSON.stringify(updatedPayload, null, 2))
      const requestStartTime = Date.now()
      
      const res = await startLoading(
        apiCall(API_ENDPOINTS.AUTH.USEREDIT, {
          method: 'PATCH',
          body: JSON.stringify(updatedPayload),
        })
      );
      
      const requestEndTime = Date.now()
      const requestDuration = requestEndTime - requestStartTime
      
      console.log('[USERINFO] API 요청 완료')
      console.log('[USERINFO] 요청 소요 시간:', requestDuration + 'ms')
      console.log('[USERINFO] 응답 상태 코드:', res.status)
  
      if (res.status === HTTP_STATUS.OK) {
        const data = await res.json().catch(() => null)
        console.log('[USERINFO] === 사용자 정보 수정 성공 ===')
        console.log('[USERINFO] 응답 데이터:', data)
        
        const newUserData = {
          ...original,
          ...updatedPayload,
        };
        console.log('[USERINFO] 새로운 사용자 데이터:', newUserData)
        
        localStorage.setItem('cachedUserInfo', JSON.stringify(newUserData));
        console.log('[USERINFO] 캐시 업데이트 완료')
        
        updateUserState(newUserData);
        console.log('[USERINFO] 상태 업데이트 완료')
        
        setUserPassword('');
        setUserPasswordConfirm('');
        console.log('[USERINFO] 비밀번호 필드 초기화 완료')
        
        alert('사용자 정보 수정 성공!')
      } else {
        const errorData = await res.json().catch(() => null)
        console.error('[USERINFO] === 사용자 정보 수정 실패 ===')
        console.error('[USERINFO] 오류 상태 코드:', res.status)
        console.error('[USERINFO] 오류 응답 데이터:', errorData)
        alert(`사용자 정보 수정 실패: ${errorData?.message || '알 수 없는 오류'}`)
      }
    } catch (error) {
      console.error('[USERINFO] === 사용자 정보 수정 오류 ===')
      console.error('[USERINFO] 오류 타입:', error.name)
      console.error('[USERINFO] 오류 메시지:', error.message)
      console.error('[USERINFO] 오류 스택:', error.stack)
      console.error('[USERINFO] 전체 오류 객체:', error)
      alert(`사용자 정보 수정 중 오류가 발생했습니다: ${error.message}`)
    } finally {
      console.log('[USERINFO] === 사용자 정보 수정 프로세스 종료 ===')
    }
  }, [
    userEmail,
    userPassword,
    userPasswordConfirm,
    userName,
    userWeight,
    userCaffeineLimit,
    startLoading,
    updateUserState,
  ])
  
  // 토큰 갱신 함수 (TokenTest에서 가져옴)
  const refreshToken = useCallback(async () => {
    try {
      console.log('[USERINFO] === 토큰 갱신 시작 ===')
      console.log('[USERINFO] 현재 시간:', new Date().toISOString())
      
      const currentToken = localStorage.getItem('AccessToken')
      console.log('[USERINFO] 현재 AccessToken 존재:', currentToken ? '있음' : '없음')
      if (currentToken) {
        console.log('[USERINFO] 현재 토큰 앞 30자:', currentToken.substring(0, 30))
        console.log('[USERINFO] 현재 토큰 길이:', currentToken.length)
      }
      
      console.log('[USERINFO] API 요청 시작')
      console.log('[USERINFO] API 엔드포인트:', API_ENDPOINTS.AUTH.REFRESH)
      console.log('[USERINFO] 요청 메서드: POST')
      console.log('[USERINFO] 요청 옵션: credentials include')
      const requestStartTime = Date.now()
      
      const res = await startLoading(
        apiCall(API_ENDPOINTS.AUTH.REFRESH, {
          method: 'POST',
          credentials: 'include',
        })
      )
      
      const requestEndTime = Date.now()
      const requestDuration = requestEndTime - requestStartTime
      
      console.log('[USERINFO] API 요청 완료')
      console.log('[USERINFO] 요청 소요 시간:', requestDuration + 'ms')
      console.log('[USERINFO] 응답 상태 코드:', res.status)
      
      const data = await res.json()
      console.log('[USERINFO] 토큰 갱신 응답:', data)
      console.log('[USERINFO] 응답 데이터 키들:', Object.keys(data))
      
      if (res.status === HTTP_STATUS.OK) {
        console.log('[USERINFO] === 토큰 갱신 성공 ===')
        console.log('[USERINFO] 새로운 토큰 받음:', data.newToken ? '있음' : '없음')
        if (data.newToken) {
          console.log('[USERINFO] 새 토큰 앞 30자:', data.newToken.substring(0, 30))
          console.log('[USERINFO] 새 토큰 길이:', data.newToken.length)
        }
        
        localStorage.setItem('AccessToken', data.newToken)
        console.log('[USERINFO] 새 토큰 저장 완료')
        
        setIsLoggedIn(true)
        console.log('[USERINFO] 로그인 상태 업데이트 완료')
        
        updateTokenInfo()
        console.log('[USERINFO] 토큰 정보 업데이트 완료')
        
        alert('토큰 갱신 성공!')
      } else if (res.status === HTTP_STATUS.FORBIDDEN) {
        console.error('[USERINFO] === 403 잘못된 Refresh Token ===')
        console.error('[USERINFO] 오류 응답:', data)
        
        localStorage.removeItem('AccessToken')
        localStorage.removeItem('cachedUserInfo')
        console.log('[USERINFO] 토큰 및 캐시 삭제 완료')
        
        setIsLoggedIn(false)
        console.log('[USERINFO] 로그인 상태 false로 설정')
        
        alert(ERROR_MESSAGES.INVALID_TOKEN)
      } else if (res.status === HTTP_STATUS.UNAUTHORIZED) {
        console.error('[USERINFO] === 401 만료된 Refresh Token ===')
        console.error('[USERINFO] 오류 응답:', data)
        
        localStorage.removeItem('AccessToken')
        localStorage.removeItem('cachedUserInfo')
        console.log('[USERINFO] 토큰 및 캐시 삭제 완료')
        
        setIsLoggedIn(false)
        console.log('[USERINFO] 로그인 상태 false로 설정')
        
        alert(ERROR_MESSAGES.TOKEN_EXPIRED)
      } else {
        console.error('[USERINFO] === 기타 토큰 갱신 실패 ===')
        console.error('[USERINFO] 응답 코드:', res.status)
        console.error('[USERINFO] 오류 응답:', data)
        alert(`토큰 갱신 실패: ${data.message || '알 수 없는 오류'}`)
      }
    } catch (error) {
      console.error('[USERINFO] === 토큰 갱신 오류 ===')
      console.error('[USERINFO] 오류 타입:', error.name)
      console.error('[USERINFO] 오류 메시지:', error.message)
      console.error('[USERINFO] 오류 스택:', error.stack)
      console.error('[USERINFO] 전체 오류 객체:', error)
      console.log('[USERINFO] 현재 네트워크 상태:', navigator.onLine ? '온라인' : '오프라인')
      alert(`토큰 갱신 오류: ${error.message}`)
    } finally {
      console.log('[USERINFO] === 토큰 갱신 프로세스 종료 ===')
    }
  }, [startLoading, updateTokenInfo])
  
  // 자동 리프레시 토글
  const toggleAutoRefresh = useCallback(() => {
    console.log('[USERINFO] === 자동 리프레시 토글 ===')
    console.log('[USERINFO] 현재 자동 리프레시 상태:', autoRefreshEnabled)
    
    setAutoRefreshEnabled(prev => {
      const newState = !prev
      console.log('[USERINFO] 자동 리프레시 상태 변경:', prev, '->', newState)
      console.log('[USERINFO] 현재 남은 시간:', timeLeft)
      
      if (newState) {
        console.log('[USERINFO] 자동 리프레시 활성화됨')
        if (timeLeft <= 60) {
          console.log('[USERINFO] 남은 시간이 1분 이하이므로 즉시 갱신 예정')
        }
      } else {
        console.log('[USERINFO] 자동 리프레시 비활성화됨')
      }
      
      return newState
    })
  }, [autoRefreshEnabled, timeLeft])
  
  // 자동 리프레시 로직
useEffect(() => {
  if (autoRefreshEnabled && timeLeft > 0) {
    console.log('[USERINFO] 자동 리프레시 인터벌 시작')
    
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1
        
        if (newTime <= 60 && newTime > 58) { // 60초가 되는 순간에만 갱신
          console.log('[USERINFO] 자동 갱신 트리거 - 남은 시간:', newTime)
          refreshToken()
        }
        
        if (newTime <= 0) {
          console.log('[USERINFO] 토큰 만료 - 인터벌 중지')
          return 0
        }
        
        return newTime
      })
    }, 1000)
  } else {
    if (intervalRef.current) {
      console.log('[USERINFO] 자동 리프레시 인터벌 중지')
      clearInterval(intervalRef.current)
    }
  }
  
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }
}, [autoRefreshEnabled]) // timeLeft 제거, refreshToken도 제거
  
  // 토큰 상태 변화 감지
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'AccessToken') {
        setIsLoggedIn(!!e.newValue)
        updateTokenInfo()
        console.log('토큰값 변화 감지')
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [updateTokenInfo])
  
  // 컴포넌트 마운트 시 토큰 정보 업데이트
  useEffect(() => {
    updateTokenInfo()
  }, [updateTokenInfo])
  
  // 시간 포맷팅 함수
  const formatTime = (seconds) => {
    if (seconds <= 0) return '만료됨'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          사용자 정보 + 토큰 테스트
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 토큰 정보 섹션 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              토큰 정보 및 관리
            </h2>
            
            {/* 로그인 상태 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                로그인 상태:
              </label>
              <div className={`p-3 rounded text-center font-semibold ${
                isLoggedIn ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {isLoggedIn ? '로그인됨' : '로그아웃됨'}
              </div>
            </div>
            
            {/* 토큰 표시 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                현재 AccessToken:
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded border text-xs break-all max-h-32 overflow-y-auto">
                {localStorage.getItem('AccessToken') || '토큰이 없습니다'}
              </div>
            </div>
            
            {/* 토큰 남은 시간 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                토큰 남은 시간:
              </label>
              <div className={`p-3 rounded text-center font-mono text-lg ${
                timeLeft > 300 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                timeLeft > 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {formatTime(timeLeft)}
              </div>
            </div>
            
            {/* 토큰 갱신 버튼 */}
            <button
              onClick={refreshToken}
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? '갱신 중...' : '토큰 갱신'}
            </button>
            
            {/* 자동 리프레시 토글 */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  자동 리프레시 (1분 전 갱신)
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  토큰이 1분 남으면 자동으로 갱신됩니다
                </p>
              </div>
              <button
                onClick={toggleAutoRefresh}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  autoRefreshEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  autoRefreshEnabled ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
          
          {/* 사용자 정보 섹션 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              사용자 정보 조회 및 수정
            </h2>
            
            {/* 사용자 정보 표시 영역 */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">ID:</span>
                  <span className="text-gray-900 dark:text-white">{userId || '정보 없음'}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">이메일:</span>
                  <span className="text-gray-900 dark:text-white">{userEmail || '정보 없음'}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">이름:</span>
                  <span className="text-gray-900 dark:text-white">{userName || '정보 없음'}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">몸무게:</span>
                  <span className="text-gray-900 dark:text-white">{userWeight ? `${userWeight}kg` : '정보 없음'}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 w-24">카페인 제한:</span>
                  <span className="text-gray-900 dark:text-white">{userCaffeineLimit ? `${userCaffeineLimit}mg` : '정보 없음'}</span>
              </div>
            </div>

            <button
              onClick={getUserInfo}
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              {isLoading ? '정보 가져오는 중...' : '사용자 정보 가져오기'}
            </button>

            {/* 정보 수정 폼 */}
            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1 dark:text-gray-300">
                  이메일
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  disabled={isLoading}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1 dark:text-gray-300">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  disabled={isLoading}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1 dark:text-gray-300">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={userPasswordConfirm}
                  onChange={(e) => setUserPasswordConfirm(e.target.value)}
                  disabled={isLoading}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1 dark:text-gray-300">
                  이름
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={isLoading}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1 dark:text-gray-300">
                  몸무게 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={userWeight}
                  onChange={(e) => setUserWeight(e.target.value)}
                  disabled={isLoading}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1 dark:text-gray-300">
                  일일 카페인 제한 (mg)
                </label>
                <input
                  type="number"
                  value={userCaffeineLimit}
                  onChange={(e) => setUserCaffeineLimit(e.target.value)}
                  disabled={isLoading}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>

            <button
              onClick={editUserInfo}
              disabled={isLoading || !hasChanges}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? '수정 중...' : '사용자 정보 수정하기'}
            </button>
          </div>
        </div>
      </div>
      </div>
      </div>
  )
}

export default UserInfoTest;
