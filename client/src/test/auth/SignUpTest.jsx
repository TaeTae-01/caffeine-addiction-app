import { useState,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoading from '../../hooks/useLoading';
import { API_ENDPOINTS, apiCall } from '../../config/api';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../config/constants';

function SignUpTest() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [dailyCaffeineLimit, setDailyCaffeineLimit] = useState('');

  const [isLoading, startLoading] = useLoading();

  // fetch 보내는 템플릿 코드, 여기에 파라미터로 payload를 담아서 api요청 날리면 됨
  const registerUser = useCallback((credential) => {
      return apiCall(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify(credential)
      });
    }, []);

  const handleSignUp = useCallback(async (e) => {
    // 버튼 누르고 data 변경이 일어나면 안되니까 막기
    e.preventDefault();

    // 데이터 유효성 검증 (간단하게 형식만 검사)
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPassword = password && password.length >= 6;
    const isValidName = name && name.length >= 2;
    const isValidWeight = !isNaN(parseFloat(weight)) && parseFloat(weight) > 0;
    const isValidCaffeineLimit = !isNaN(parseInt(dailyCaffeineLimit)) && parseInt(dailyCaffeineLimit) > 0;

    // 입력값이 잘못되면 return 시킴
    if (!isValidEmail || !isValidPassword || !isValidName || !isValidWeight || !isValidCaffeineLimit) {
      console.log('[SIGNUP] 유효성 검사 실패 - 요청 중단');
      alert('잘못된 입력값이 존재합니다.');
      return;
    }

    // user가 입력한 데이터 검증 로그
    console.log('=== 회원가입 테스트 시작 ===');
    console.log('[SIGNUP] 현재 시간:', new Date().toISOString());
    console.log('[SIGNUP] 입력값 검증:');
    console.log('[SIGNUP] - 이메일:', email);
    console.log('[SIGNUP] - 이메일 형식 유효성:', isValidEmail);
    console.log('[SIGNUP] - 비밀번호 길이:', parseInt(password.length));
    console.log('[SIGNUP] - 비밀번호 입력 여부:', password ? '입력됨' : '비어있음');
    console.log('[SIGNUP] - 비밀번호 유효성:', isValidPassword);
    console.log('[SIGNUP] - 이름:', name);
    console.log('[SIGNUP] - 이름 길이:', name.length);
    console.log('[SIGNUP] - 이름 유효성:', isValidName);
    console.log('[SIGNUP] - 몸무게 (문자열):', weight);
    console.log('[SIGNUP] - 몸무게 숫자 변환:', parseFloat(weight));
    console.log('[SIGNUP] - 몸무게 유효성:', isValidWeight);
    console.log('[SIGNUP] - 카페인 제한 (문자열):', dailyCaffeineLimit);
    console.log('[SIGNUP] - 카페인 제한 숫자 변환:', parseInt(dailyCaffeineLimit));
    console.log('[SIGNUP] - 카페인 제한 유효성:', isValidCaffeineLimit);
    console.log('[SIGNUP] - 전체 폼 유효성:', isValidEmail && isValidPassword && isValidName && isValidWeight && isValidCaffeineLimit);
      
    // 검증이 완료되고나서 API 요청 보낼 payload
    // 서버에서 요청하는 type을 잘 맞춰야함 (몸무게, 일일카페인제한)
    const payload = {
      // input type: text는 string
      email: email,
      password: password,
      name: name,
      weight: parseFloat(weight), // input type='number'의 value는 항상 string으로 반환되므로 숫자로 파싱해줘야한다
      dailyCaffeineLimit: parseInt(dailyCaffeineLimit)// input type='number'의 value는 항상 string으로 반환되므로 숫자로 파싱해줘야한다
    };
    
    // 전송하는 페이로드 로그
    console.log('[SIGNUP] 전송할 페이로드:', payload);
    console.log('[SIGNUP] 페이로드 JSON:', JSON.stringify(payload, null, 2));
    console.log('[SIGNUP] API 엔드포인트:', API_ENDPOINTS.AUTH.REGISTER);
    console.log('[SIGNUP] 요청 메서드: POST');
    console.log('[SIGNUP] 페이로드 데이터 타입 체크:');
    console.log('[SIGNUP] - email 타입:', typeof payload.email);
    console.log('[SIGNUP] - password 타입:', typeof payload.password);
    console.log('[SIGNUP] - name 타입:', typeof payload.name);
    console.log('[SIGNUP] - weight 타입:', typeof payload.weight);
    console.log('[SIGNUP] - dailyCaffeineLimit 타입:', typeof payload.dailyCaffeineLimit);

    // API 요청을 시작하는 try ~ catch ~ finally문 (try 진행하다가 error 나면 바로 catch 구문으로 빠짐, finally는 항상 실행되고 요청 마무리하는 작업)
    try {
      // 요청 시작 로그 (시간)
      console.log('[SIGNUP] API 요청 시작...');
      const requestStartTime = Date.now();
      
      // API 요청 보내고 돌아오는 응답값 받는 변수
      const res = await startLoading(registerUser(payload));

      // 응답값 로그 (시간)
      const requestEndTime = Date.now();
      const requestDuration = requestEndTime - requestStartTime;
      
      console.log('[SIGNUP] API 요청 완료');
      console.log('[SIGNUP] 요청 소요 시간:', requestDuration + 'ms');

      // 응답값의 body 내용 json 파싱
      const data = await res.json();

      // 응답값 확인하는 로그
      console.log('=== 회원가입 응답 정보 ===');
      console.log('[SIGNUP] 응답 상태 코드:', res.status);
      console.log('[SIGNUP] 응답 상태 텍스트:', res.statusText);
      console.log('[SIGNUP] 응답 헤더:', Object.fromEntries(res.headers.entries()));
      console.log('[SIGNUP] 응답 데이터:', data);
      console.log('[SIGNUP] 응답 데이터 타입:', typeof data);
      console.log('[SIGNUP] 응답 데이터 키들:', Object.keys(data));
            
      // 응답값에 따라 처리하는 구문
      // constants.js 를 통해서 깔끔하게 변경됨
      if (res.status === HTTP_STATUS.OK) {
        console.log('[SIGNUP] === 회원가입 성공 처리 ===');
        console.log('[SIGNUP] 성공 응답 코드:', data.code);
        console.log('[SIGNUP] 성공 응답 상태:', data.status);
        console.log('[SIGNUP] 성공 응답 메시지:', data.message);
        console.log('[SIGNUP] 생성된 사용자 정보:', data.user || '없음');
        
        alert("회원가입 성공");
        
        // 회원가입 성공 시 로그인 테스트 페이지로 리다이렉션
        console.log('[SIGNUP] 리다이렉션 시작: /test/auth/signin');
        navigate('/test/auth/signin');
        console.log('[SIGNUP] 리다이렉션 완료');
      }
      else if (res.status === HTTP_STATUS.BAD_REQUEST) {
        console.log('[SIGNUP] === 400 유효성 검사 오류 처리 ===');
        console.log('[SIGNUP] 유효성 검사 오류 메시지:', data.message);
        console.log('[SIGNUP] 유효성 검사 오류 코드:', data.code || '없음');
        console.log('[SIGNUP] 유효성 검사 오류 상세:', data.details || '없음');
        console.log('[SIGNUP] 상수 메시지:', ERROR_MESSAGES.VALIDATION);
        alert(`유효성 검사 오류: ${data.message}`);
      }
      else if (res.status === HTTP_STATUS.CONFLICT) {
        console.log('[SIGNUP] === 409 이메일 중복 오류 처리 ===');
        console.log('[SIGNUP] 이메일 중복 오류 메시지:', data.message);
        console.log('[SIGNUP] 이메일 중복 오류 코드:', data.code || '없음');
        console.log('[SIGNUP] 중복된 이메일:', email);
        console.log('[SIGNUP] 상수 메시지:', ERROR_MESSAGES.DUPLICATE_EMAIL);
        alert(`이메일 중복 오류: ${data.message}`);
      }
      else if (res.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        console.log('[SIGNUP] === 500 서버 오류 처리 ===');
        console.log('[SIGNUP] 서버 오류 메시지:', data.message);
        console.log('[SIGNUP] 서버 오류 코드:', data.code || '없음');
        console.log('[SIGNUP] 상수 메시지:', ERROR_MESSAGES.SERVER);
        alert(ERROR_MESSAGES.SERVER);
      }
      else {
        console.log('[SIGNUP] === 기타 오류 처리 ===');
        console.log('[SIGNUP] 응답 코드:', res.status);
        console.log('[SIGNUP] 기타 오류 메시지:', data.message);
        console.log('[SIGNUP] 기타 오류 코드:', data.code || '없음');
        console.log('[SIGNUP] 기타 오류 상세:', data);
        alert(`오류 발생: ${data.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      // 오류 발생시 catch문에서 처리해줌
      console.log('[SIGNUP] === 네트워크 오류 발생 ===');
      console.error('[SIGNUP] 오류 타입:', error.name);
      console.error('[SIGNUP] 오류 메시지:', error.message);
      console.error('[SIGNUP] 오류 스택:', error.stack);
      console.error('[SIGNUP] 전체 오류 객체:', error);
      console.log('[SIGNUP] 현재 네트워크 상태:', navigator.onLine ? '온라인' : '오프라인');
      alert(`${ERROR_MESSAGES.NETWORK}: ${error.message}`);
    } finally {
      // finally는 성공/실패와 관계없이 항상 실행되는 블록
      console.log('[SIGNUP] === 회원가입 프로세스 종료 ===');
      console.log('[SIGNUP] 종료 시간:', new Date().toISOString());
    }
  }, [email, password, name, weight, dailyCaffeineLimit, startLoading, registerUser]);


  return (
    // 전체 컨테이너: 화면 중앙 정렬을 위한 flexbox, 최소 높이, 배경색, 패딩, 다크 모드 지원
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      {/* 폼 컨테이너: 흰색 배경, 패딩, 둥근 모서리, 그림자, 전체 너비, 최대 너비, 다크 모드 지원 */}
      <form
        onSubmit={handleSignUp}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm dark:bg-gray-800"
      >
        {/* 폼 제목: 큰 글자, 굵은 글씨, 중앙 정렬, 하단 마진, 다크 모드 지원 */}
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          회원가입 테스트 폼
        </h1>

        {/* 이메일 레이블: 블록 요소, 작은 글자, 굵은 글씨, 하단 마진, 다크 모드 지원 */}
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
          이메일
        </label>
        {/* 이메일 입력 필드: 그림자, 외관 없음, 경계선, 둥근 모서리, 전체 너비, 패딩, 간격 좁게, 포커스 스타일, 하단 마진, 다크 모드 지원 */}
        <input
          type='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />

        {/* 비밀번호 레이블: 블록 요소, 작은 글자, 굵은 글씨, 하단 마진, 다크 모드 지원 */}
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
          비밀번호
        </label>
        {/* 비밀번호 입력 필드: 그림자, 외관 없음, 경계선, 둥근 모서리, 전체 너비, 패딩, 간격 좁게, 포커스 스타일, 하단 마진, 다크 모드 지원 */}
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />

        {/* 이름 레이블: 블록 요소, 작은 글자, 굵은 글씨, 하단 마진, 다크 모드 지원 */}
        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
          이름
        </label>
        {/* 이름 입력 필드: 그림자, 외관 없음, 경계선, 둥근 모서리, 전체 너비, 패딩, 간격 좁게, 포커스 스타일, 하단 마진, 다크 모드 지원 */}
        <input
          type='text'
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />

        {/* 몸무게 레이블: 블록 요소, 작은 글자, 굵은 글씨, 하단 마진, 다크 모드 지원 */}
        <label htmlFor="weight" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
          몸무게
        </label>
        {/* 몸무게 입력 필드: 숫자 타입, 소수점 단위, 그림자, 외관 없음, 경계선, 둥근 모서리, 전체 너비, 패딩, 간격 좁게, 포커스 스타일, 하단 마진, 다크 모드 지원 */}
        <input
          type='number'
          id='weight'
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          disabled={isLoading}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />

        {/* 일일 카페인 제한 레이블: 블록 요소, 작은 글자, 굵은 글씨, 하단 마진, 다크 모드 지원 */}
        <label htmlFor="dailyCaffeineLimit" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
          일일 카페인 제한 (mg)
        </label>
        {/* 일일 카페인 제한 입력 필드: 숫자 타입, 그림자, 외관 없음, 경계선, 둥근 모서리, 전체 너비, 패딩, 간격 좁게, 포커스 스타일, 하단 마진 증가, 다크 모드 지원 */}
        <input
          type='number'
          id='dailyCaffeineLimit'
          value={dailyCaffeineLimit}
          onChange={(e) => setDailyCaffeineLimit(e.target.value)}
          disabled={isLoading}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        {/* 회원가입 버튼: 배경색, 호버 효과, 흰색 텍스트, 굵은 글씨, 패딩, 둥근 모서리, 전체 너비, 포커스 스타일, 그림자, 전환 효과, 비활성화 스타일 */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline transition duration-200 ease-in-out
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '처리 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
}

export default SignUpTest
