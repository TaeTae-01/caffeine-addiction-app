import { useCallback } from "react";
import { API_ENDPOINTS, apiCall } from "../../config/api";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../config/constants";
import useLoading from "../../hooks/useLoading";

function LogoutTest() {

  const [isLoading, startLoading] = useLoading();

    const logoutUser = useCallback(() => {
      return apiCall(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        credentials: 'include', // 쿠키 자동 처리를 위해서 필요함
      });
    }, []);
  
  const handleLogout = useCallback(async (e) => {
    console.log('[LOGOUT] === 로그아웃 테스트 시작 ===')
    console.log('[LOGOUT] 현재 시간:', new Date().toISOString())
    
    try {
      // 토큰이 로컬 스토리지에 있는지 체크
      const AccessToken = localStorage.getItem('AccessToken')
      console.log('[LOGOUT] 토큰 존재 여부:', AccessToken ? '있음' : '없음')
      
      if (AccessToken) {
        console.log('[LOGOUT] 토큰 길이:', AccessToken.length)
        console.log('[LOGOUT] 토큰 앞 30자:', AccessToken.substring(0, 30))
        console.log('[LOGOUT] 토큰 뒤 10자:', AccessToken.substring(AccessToken.length - 10))
        
        // 토큰 정보 파싱 및 확인
        try {
          const tokenParts = AccessToken.split('.')
          console.log('[LOGOUT] 토큰 파트 개수:', tokenParts.length)
          
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]))
            console.log('[LOGOUT] 토큰 페이로드:', payload)
            console.log('[LOGOUT] 토큰 페이로드 키들:', Object.keys(payload))
            
            const currentTime = Math.floor(Date.now() / 1000)
            console.log('[LOGOUT] 현재 시간 (초):', currentTime)
            console.log('[LOGOUT] 토큰 만료 시간:', payload.exp)
            console.log('[LOGOUT] 토큰 남은 시간 (초):', payload.exp - currentTime)
            console.log('[LOGOUT] 토큰 남은 시간 (분):', (payload.exp - currentTime) / 60)
            console.log('[LOGOUT] 토큰 만료 여부:', payload.exp < currentTime ? '만료됨' : '유효함')
          }
        } catch (tokenError) {
          console.error('[LOGOUT] 토큰 파싱 오류:', tokenError)
          console.error('[LOGOUT] 토큰 파싱 오류 메시지:', tokenError.message)
        }
      }

      // 현재 쿠키 상태 확인
      console.log('[LOGOUT] 현재 브라우저 쿠키:', document.cookie || '없음')
      console.log('[LOGOUT] 쿠키 길이:', document.cookie.length)
      
      if (!AccessToken) {
        console.log('[LOGOUT] 이미 로그아웃 상태 - 토큰 없음')
        alert('이미 로그아웃 상태입니다.')
        return
      }

      // 요청 정보 출력
      console.log('[LOGOUT] === API 요청 정보 ===')
      console.log('[LOGOUT] API 엔드포인트:', API_ENDPOINTS.AUTH.LOGOUT)
      console.log('[LOGOUT] 요청 메서드: POST')
      console.log('[LOGOUT] 요청 옵션: credentials include')
      console.log('[LOGOUT] Authorization 헤더:', `Bearer ${AccessToken.substring(0, 30)}...`)
      console.log('[LOGOUT] Content-Type: application/json')
      
      const requestStartTime = Date.now()
      console.log('[LOGOUT] API 요청 시작...')

      // logout API 요청 날리기
      const res = await startLoading(logoutUser())
      
      const requestEndTime = Date.now()
      const requestDuration = requestEndTime - requestStartTime
      
      console.log('[LOGOUT] API 요청 완료')
      console.log('[LOGOUT] 요청 소요 시간:', requestDuration + 'ms')

      console.log('[LOGOUT] === 로그아웃 응답 정보 ===')
      console.log('[LOGOUT] 응답 상태 코드:', res.status)
      console.log('[LOGOUT] 응답 상태 텍스트:', res.statusText)
      console.log('[LOGOUT] 응답 헤더:', Object.fromEntries(res.headers.entries()))

      const data = await res.json()
      console.log('[LOGOUT] 응답 데이터:', data)
      console.log('[LOGOUT] 응답 데이터 타입:', typeof data)
      console.log('[LOGOUT] 응답 데이터 키들:', Object.keys(data))

      if (res.status === HTTP_STATUS.OK) {
        console.log('[LOGOUT] === 로그아웃 성공 처리 ===')
        console.log('[LOGOUT] 서버 응답 코드:', data.code)
        console.log('[LOGOUT] 서버 응답 상태:', data.status)
        console.log('[LOGOUT] 서버 응답 메시지:', data.message)
        
        // AccessToken 삭제
        localStorage.removeItem('AccessToken')
        console.log('[LOGOUT] Access Token 삭제 완료')
        
        // 캐시된 사용자 정보도 삭제
        localStorage.removeItem('cachedUserInfo')
        console.log('[LOGOUT] 캐시된 사용자 정보 삭제 완료')
        
        console.log('[LOGOUT] 로그아웃 성공!')
        alert('로그아웃되었습니다.')
        
      } else if (res.status === HTTP_STATUS.FORBIDDEN) {
        console.log('[LOGOUT] === 403 권한 없음 오류 처리 ===')
        console.log('[LOGOUT] 오류 상세:', data)
        console.log('[LOGOUT] 오류 메시지:', data.message || '없음')
        console.log('[LOGOUT] 오류 코드:', data.code || '없음')
        
        // AccessToken 삭제 (오류 발생시에도 토큰 삭제)
        localStorage.removeItem('AccessToken')
        localStorage.removeItem('cachedUserInfo')
        console.log('[LOGOUT] 토큰 및 캐시 삭제 완료')
        
        alert(ERROR_MESSAGES.FORBIDDEN)
        
      } else if (res.status === HTTP_STATUS.UNAUTHORIZED) {
        console.log('[LOGOUT] === 401 인증 실패 오류 처리 ===')
        console.log('[LOGOUT] 오류 상세:', data)
        console.log('[LOGOUT] 오류 메시지:', data.message || '없음')
        console.log('[LOGOUT] 오류 코드:', data.code || '없음')
        
        // AccessToken 삭제 (오류 발생시에도 토큰 삭제)
        localStorage.removeItem('AccessToken')
        localStorage.removeItem('cachedUserInfo')
        console.log('[LOGOUT] 토큰 및 캐시 삭제 완료')
        
        alert(ERROR_MESSAGES.UNAUTHORIZED)
        
      } else {
        console.log('[LOGOUT] === 기타 오류 처리 ===')
        console.log('[LOGOUT] 응답 코드:', res.status)
        console.log('[LOGOUT] 기타 오류 데이터:', data)
        console.log('[LOGOUT] 서버 응답 상태:', data.status || '없음')
        console.log('[LOGOUT] 서버 오류 메시지:', data.message || '없음')
        console.log('[LOGOUT] 서버 오류 코드:', data.code || '없음')
        
        // AccessToken 삭제 (오류 발생시에도 토큰 삭제)
        localStorage.removeItem('AccessToken')
        localStorage.removeItem('cachedUserInfo')
        console.log('[LOGOUT] 토큰 및 캐시 삭제 완료')

        alert(`로그아웃 중 오류가 발생했습니다. (${res.status}: ${data.message || '알 수 없는 오류'})`)
      }
      
      console.log('[LOGOUT] === 로그아웃 프로세스 종료 ===')
      console.log('[LOGOUT] 최종 토큰 상태:', localStorage.getItem('AccessToken') ? '존재' : '없음')
      console.log('[LOGOUT] 최종 캐시 상태:', localStorage.getItem('cachedUserInfo') ? '존재' : '없음')
      
      // 페이지 새로고침, 로그 확인할 땐 개발자도구 -> console/network preserve log 켜서 안날라가게 막아야함      
      console.log('[LOGOUT] 페이지 새로고침 실행')
      window.location.reload()
      
    } catch (error) {
      console.log('[LOGOUT] === 네트워크 오류 발생 ===')
      console.error('[LOGOUT] 오류 타입:', error.name)
      console.error('[LOGOUT] 오류 메시지:', error.message)
      console.error('[LOGOUT] 오류 스택:', error.stack)
      console.error('[LOGOUT] 전체 오류 객체:', error)
      console.log('[LOGOUT] 현재 네트워크 상태:', navigator.onLine ? '온라인' : '오프라인')
      
      // 네트워크 오류 시에도 로컬 토큰 삭제
      localStorage.removeItem('AccessToken')
      localStorage.removeItem('cachedUserInfo')
      console.log('[LOGOUT] 네트워크 오류 시 토큰 및 캐시 삭제 완료')
      
      alert(`${ERROR_MESSAGES.NETWORK}: ${error.message}`)
    } finally {
      console.log('[LOGOUT] === 로그아웃 테스트 종료 ===')
      console.log('[LOGOUT] 종료 시간:', new Date().toISOString())
    }
  }, []);

  return (
    // 전체 컨테이너: flexbox를 사용하여 중앙 정렬, 최소 높이, 배경색, 패딩, 다크 모드 지원
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      {/* 메인 콘텐츠 컨테이너: 흰색 배경, 패딩, 둥근 모서리, 그림자, 최대 너비, 텍스트 중앙 정렬, 다크 모드 지원 */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center dark:bg-gray-800">
        {/* 제목: 글자 크기, 굵기, 중앙 정렬, 하단 마진, 글자 색상, 다크 모드 지원 */}
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          로그아웃 테스트 폼
        </h1>
        {/* 정보 표시 박스: 하단 마진, 패딩, 배경색, 둥근 모서리, 다크 모드 지원 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
          <p className="mb-2 text-gray-700 dark:text-gray-300">
            <strong className="font-semibold">현재 Access Token:</strong> {localStorage.getItem('AccessToken') ? '있음' : '없음'}
          </p>
          <p className="mb-2 text-gray-700 dark:text-gray-300">
            <strong className="font-semibold">현재 쿠키:</strong> {document.cookie || '없음'}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong className="font-semibold">로그인 상태:</strong> {localStorage.getItem('AccessToken') ? '로그인됨' : '로그아웃됨'}
          </p>
        </div>
        {/* 로그아웃 버튼: 배경색 (빨간색), 호버 효과, 텍스트 색상, 굵기, 패딩, 둥근 모서리, 전체 너비, 포커스 스타일, 전환 효과, 비활성화 스타일 */}
        <button
          onClick={handleLogout}
          disabled={!localStorage.getItem('AccessToken') || isLoading} // 토큰이 없거나 로딩 중일 때 비활성화
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '로그아웃 중...' : '로그아웃'}
        </button>
      </div>
    </div>
  );
}

export default LogoutTest;
