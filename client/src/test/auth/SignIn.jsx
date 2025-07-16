import { useCallback, useState } from 'react';
import useLoading from '../../hooks/useLoading';
import { API_ENDPOINTS, apiCall } from '../../config/api';
import { ERROR_MESSAGES, HTTP_STATUS, STORAGE_KEYS } from '../../config/constants';

function SignIn() {

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

  const handleSignUp = useCallback(async (e) => { //async? 비동기로 이벤트 발생시 처리하는건가
    e.preventDefault(); // 입력한 정보로 보내야하니까 버튼 누르고 변경이 생기면 안됨

    // user가 입력한 데이터 검증
    console.log('=== 로그인 시작 ===');
    console.log('입력값 검증:');
    console.log('- 이메일:', email);
    console.log('- 비밀번호:', password ? '입력됨' : '비어있음');
    
    // 보낼 data payload로 감싸기
    const payload = {
      email: email,
      password: password
    };

    // 어떤거 보내는지 로그
    console.log('전송할 페이로드:', payload);
    console.log('페이로드 JSON:', JSON.stringify(payload, null, 2));

    try {
      // api요청 중앙화 이후 이 한줄로 끝남
      const res = await startLoading(loginUser(payload));
      
      /* 기존 코드
      const res = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: 'include' // 쿠키 자동 처리를 위해 필요
        }
      ); */
      
      // 응답값 json 파싱
      const data = await res.json();

      // 응답값 확인하는 로그
      console.log('=== 응답 정보 ===');
      console.log('응답 상태 코드:', res.status);
      console.log('응답 상태 텍스트:', res.statusText);
      console.log('응답 헤더:', Object.fromEntries(res.headers.entries()));
      
      // 응답 data에 따라서 처리하는 code
      // constants.js 를 통해서 깔끔하게 변경됨
      if (res.status === HTTP_STATUS.OK) {

        // 성공 시 응답 로그
        console.log('서버 응답 코드:', data.code);
        console.log('서버 응답 상태:', data.status);
        console.log('서버 응답 메시지:', data.message);
        alert(" 로그인 성공");

        // JWT 토큰이 있다면 저장 (이것도 constants.js 사용)
        if (data.token) {
          console.log('Access 토큰 받음:', data.token);
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.token);
          console.log('토큰 저장 완료');
        }
                
        if (data.expirationTime) {
          console.log('토큰 만료 시간:', data.expirationTime);
        }
        // 로그인 성공 시 페이지 새로고침 (로그 확인하려면 console/network에서 preserve log 체크해둬야함)
        window.location.reload();
      }
      // 미리 만들어둔 상태 코드에 따라서 오류 처리
      else if (res.status === HTTP_STATUS.UNAUTHORIZED) {
        console.log('오류 상세:', data);
        alert(ERROR_MESSAGES.UNAUTHORIZED);
      }
      else if (res.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        console.log('오류 상세:', data);
        alert(ERROR_MESSAGES.SERVER);
      }
      else {
        console.log('기타 오류', data);
        alert(`알 수 없는 오류 발생 ${data.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.log('=== 네트워크 오류 발생 ===');
      console.error('오류 타입:', error.name);
      console.error('오류 메시지:', error.message);
      console.error('전체 오류 객체:', error);
      alert(`${ERROR_MESSAGES.NETWORK}: ${error.message}`);
    }
  }, [email, password, startLoading,loginUser]); // 의존성 배열 추가 왜?

  return (
    <>
      {/* 버튼에도 온클릭 있는데 왜 폼에도 온 서브밋 해야함 ? -> 처음 코드 작성할 때만 그런거고 button type에 submit으로 바꿔주면 됨 */}
      <form onSubmit={handleSignUp}>
        <h1>로그인 테스트 폼</h1>
        <label>이메일</label>
        <input
          type='text'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading} // loading 중 버튼 비활성화
          required // null 전송 방지
        />

        <label>비밀번호</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading} // loading 중 버튼 비활성화
          required // null 전송 방지
        />
        <button type='submit'>로그인</button>
      </form>
    </>
  )
}

export default SignIn
