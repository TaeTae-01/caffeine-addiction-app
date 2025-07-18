import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoading from '../../hooks/useLoading';
import { API_ENDPOINTS, apiCall } from '../../config/api';
import { ERROR_MESSAGES, HTTP_STATUS, STORAGE_KEYS } from '../../config/constants';

function SignInTest() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 로딩 상태 관리 커스텀 훅
  const [isLoading, startLoading] = useLoading();

  const loginUser = useCallback((credential) => {
    return apiCall(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      credentials: 'include', // 쿠키 자동 처리를 위해서 필요함
      body: JSON.stringify(credential)
    });
  }, []);

  const handleSignUp = useCallback(async (e) => {
    // 입력한 정보로 보내야하니까 버튼 누르고 변경이 생기면 안됨
    e.preventDefault(); 

    // user가 입력한 데이터 검증
    console.log('=== 로그인 테스트 시작 ===');
    console.log('[SIGNIN] 현재 시간:', new Date().toISOString());
    console.log('[SIGNIN] 입력값 검증:');
    console.log('[SIGNIN] - 이메일:', email);
    console.log('[SIGNIN] - 비밀번호 길이:', password ? password.length : 0);
    console.log('[SIGNIN] - 비밀번호 입력 여부:', password ? '입력됨' : '비어있음');
    console.log('[SIGNIN] - 폼 유효성:', email && password ? '유효' : '무효');
    
    // 현재 로그인 상태 확인
    const currentToken = localStorage.getItem('AccessToken');
    console.log('[SIGNIN] 현재 토큰 상태:', currentToken ? '존재' : '없음');
    if (currentToken) {
      console.log('[SIGNIN] 기존 토큰 앞 20자:', currentToken.substring(0, 20));
    }
    
    // 보낼 data payload로 감싸기
    const payload = {
      email: email,
      password: password
    };

    // 어떤거 보내는지 로그
    console.log('[SIGNIN] 전송할 페이로드:', payload);
    console.log('[SIGNIN] 페이로드 JSON:', JSON.stringify(payload, null, 2));
    console.log('[SIGNIN] API 엔드포인트:', API_ENDPOINTS.AUTH.LOGIN);
    console.log('[SIGNIN] 요청 메서드: POST');
    console.log('[SIGNIN] 요청 헤더 credentials: include');

    try {
      console.log('[SIGNIN] API 요청 시작...');
      const requestStartTime = Date.now();
      
      // api요청 중앙화 이후 이 한줄로 끝남
      const res = await startLoading(loginUser(payload));
      
      const requestEndTime = Date.now();
      const requestDuration = requestEndTime - requestStartTime;
      
      console.log('[SIGNIN] API 요청 완료');
      console.log('[SIGNIN] 요청 소요 시간:', requestDuration + 'ms');
      
      // 응답값 json 파싱
      const data = await res.json();

      // 응답값 확인하는 로그
      console.log('=== 로그인 응답 정보 ===');
      console.log('[SIGNIN] 응답 상태 코드:', res.status);
      console.log('[SIGNIN] 응답 상태 텍스트:', res.statusText);
      console.log('[SIGNIN] 응답 헤더:', Object.fromEntries(res.headers.entries()));
      console.log('[SIGNIN] 응답 데이터:', data);
      console.log('[SIGNIN] 응답 데이터 타입:', typeof data);
      console.log('[SIGNIN] 응답 데이터 키들:', Object.keys(data));
      
      // 응답 data에 따라서 처리하는 code
      // constants.js 를 통해서 깔끔하게 변경됨
      if (res.status === HTTP_STATUS.OK) {

        // 성공 시 응답 로그
        console.log('[SIGNIN] === 로그인 성공 처리 ===');
        console.log('[SIGNIN] 서버 응답 코드:', data.code);
        console.log('[SIGNIN] 서버 응답 상태:', data.status);
        console.log('[SIGNIN] 서버 응답 메시지:', data.message);
        
        // JWT 토큰 저장 (이것도 constants.js 사용)
        if (data.token) {
          console.log('[SIGNIN] Access 토큰 받음');
          console.log('[SIGNIN] 토큰 길이:', data.token.length);
          console.log('[SIGNIN] 토큰 앞 30자:', data.token.substring(0, 30));
          console.log('[SIGNIN] 토큰 뒤 10자:', data.token.substring(data.token.length - 10));
          console.log('[SIGNIN] 저장할 키:', STORAGE_KEYS.ACCESS_TOKEN);
          
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.token);
          console.log('[SIGNIN] 토큰 저장 완료');
          
          // 저장된 토큰 확인
          const savedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          console.log('[SIGNIN] 저장된 토큰 확인:', savedToken ? '성공' : '실패');
        } else {
          console.log('[SIGNIN] 경고: 응답에 토큰이 없음');
        }
                
        if (data.expirationTime) {
          console.log('[SIGNIN] 토큰 만료 시간:', data.expirationTime);
        }
        
        if (data.refreshToken) {
          console.log('[SIGNIN] 리프레시 토큰 정보:', data.refreshToken ? '존재' : '없음');
        }
        
        console.log('[SIGNIN] 사용자 정보:', data.user || '없음');
        
        alert("로그인 성공");
        
        // 로그인 성공 시 테스트 메뉴로 리다이렉션
        console.log('[SIGNIN] 리다이렉션 시작: /test/auth');
        navigate('/test/auth');
        console.log('[SIGNIN] 리다이렉션 완료');
      }
      // 미리 만들어둔 상태 코드에 따라서 오류 처리
      else if (res.status === HTTP_STATUS.UNAUTHORIZED) {
        console.log('[SIGNIN] === 401 인증 실패 처리 ===');
        console.log('[SIGNIN] 오류 상세:', data);
        console.log('[SIGNIN] 오류 메시지:', data.message || '없음');
        console.log('[SIGNIN] 오류 코드:', data.code || '없음');
        alert(ERROR_MESSAGES.UNAUTHORIZED);
      }
      else if (res.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        console.log('[SIGNIN] === 500 서버 오류 처리 ===');
        console.log('[SIGNIN] 오류 상세:', data);
        console.log('[SIGNIN] 오류 메시지:', data.message || '없음');
        alert(ERROR_MESSAGES.SERVER);
      }
      else {
        console.log('[SIGNIN] === 기타 오류 처리 ===');
        console.log('[SIGNIN] 응답 코드:', res.status);
        console.log('[SIGNIN] 기타 오류 데이터:', data);
        console.log('[SIGNIN] 기타 오류 메시지:', data.message || '없음');
        alert(`알 수 없는 오류 발생 ${data.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.log('[SIGNIN] === 네트워크 오류 발생 ===');
      console.error('[SIGNIN] 오류 타입:', error.name);
      console.error('[SIGNIN] 오류 메시지:', error.message);
      console.error('[SIGNIN] 오류 스택:', error.stack);
      console.error('[SIGNIN] 전체 오류 객체:', error);
      console.log('[SIGNIN] 현재 네트워크 상태:', navigator.onLine ? '온라인' : '오프라인');
      alert(`${ERROR_MESSAGES.NETWORK}: ${error.message}`);
    } finally {
      console.log('[SIGNIN] === 로그인 프로세스 종료 ===');
      console.log('[SIGNIN] 최종 토큰 상태:', localStorage.getItem('AccessToken') ? '존재' : '없음');
      console.log('[SIGNIN] 종료 시간:', new Date().toISOString());
    }
  }, [email, password, startLoading,loginUser]); // 의존성 배열 추가 왜? -> 값이 변경될 때마다 업데이트 해줘야함

  return (
        // 전체 컨테이너: 화면 중앙 정렬을 위한 flexbox, 최소 높이, 배경색
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
        {/* 폼 컨테이너: 배경색, 패딩, 둥근 모서리, 그림자, 최대 너비 */}
        <form
          onSubmit={handleSignUp}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm dark:bg-gray-800"
        >
          {/* 폼 제목: 글자 크기, 글자 두께, 텍스트 중앙 정렬, 하단 마진 */}
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            로그인 테스트 폼
          </h1>
  
          {/* 이메일 레이블 */}
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
            이메일
          </label>
          {/* 이메일 입력 필드: 패딩, 테두리, 둥근 모서리, 전체 너비, 하단 마진, 포커스 스타일 */}
          <input
            type='email' // 이메일 타입으로 변경
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading} // loading 중 버튼 비활성화
            required // null 전송 방지
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
  
          {/* 비밀번호 레이블 */}
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
            비밀번호
          </label>
          {/* 비밀번호 입력 필드: 패딩, 테두리, 둥근 모서리, 전체 너비, 하단 마진, 포커스 스타일 */}
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading} // loading 중 버튼 비활성화
            required // null 전송 방지
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
  
          {/* 로그인 버튼: 배경색, 텍스트 색상, 글자 두께, 패딩, 둥근 모서리, 전체 너비, 호버/포커스/비활성화 스타일 */}
          <button
            type='submit'
            disabled={isLoading} // 로딩 중 버튼 비활성화
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline transition duration-200 ease-in-out
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
  
  )
}

export default SignInTest;
