import { useState,useCallback } from 'react';
import useLoading from '../../hooks/useLoading';
import { API_ENDPOINTS, apiCall } from '../../config/api';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../config/constants';

function SignUp() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [dailyCaffeineLimit, setDailyCaffeineLimit] = useState('');
  const [isLoading, startLoading] = useLoading();

  const registerUser = useCallback((credential) => {
      return apiCall(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify(credential)
      });
    }, []);

  const handleSignUp = useCallback(async (e) => {
    // 버튼 누르고 data 변경이 일어나면 안되니까 막기
    e.preventDefault();

    // user가 입력한 데이터 검증
    console.log('=== 로그인 시작 ===');
    console.log('입력값 검증:');
    console.log('- 이메일:', email);
    console.log('- 비밀번호:', password ? '입력됨' : '비어있음');
    console.log('- 이름:', name);
    console.log('- 몸무게:', weight);
    console.log('- 카페인 제한: ', dailyCaffeineLimit);
 
    const payload = { // email, password, name은 input type text 그대로 payload에 담아도 됨
      email: email,
      password: password,
      name: name,
      weight: parseFloat(weight), // 그런데 API 설명서 보면 float으로 받으니까 number로 오는거 파싱 해줘야함, 그러면 type: number는 어떤값이 기본일까
      dailyCaffeineLimit: parseInt(dailyCaffeineLimit)
    };
    
    // 어떤거 보내는지 로그
    console.log('전송할 페이로드:', payload);
    console.log('페이로드 JSON:', JSON.stringify(payload, null, 2));

    try {
      // API 요청 보내고 돌아오는 응답값 받는 변수
      const res = await startLoading(registerUser(payload));

      /* 기존 fetch 코드
      const res = await fetch( // fetch로 endpoint, method, headers, body를 작성해서 보내면 응답값이 변수에 담아진다.
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      ); */

      // 응답값을 json으로 파싱해서 응답값에 따라 분기 나눠서 처리하기
      const data = await res.json();

      // 응답값 확인하는 로그
      console.log('=== 응답 정보 ===');
      console.log('응답 상태 코드:', res.status);
      console.log('응답 상태 텍스트:', res.statusText);
      console.log('응답 헤더:', Object.fromEntries(res.headers.entries()));
      
      // API 설명서에 작성되어 있는 값에 따라서 근데 status랑 res에 있는 code랑 뭐가 다른거지
      
      // 응답 data에 따라서 처리하는 code
      // constants.js 를 통해서 깔끔하게 변경됨
      if (res.status === HTTP_STATUS.OK) {
        console.log("성공 & 성공 DATA: " + data.code);
        alert("회원가입 성공");
      }
      else if (res.status === HTTP_STATUS.BAD_REQUEST) {
        console.log(`유효성 검사 오류: ${data.message}`);
        console.log(ERROR_MESSAGES.VALIDATION);
      }
      else if (res.status === HTTP_STATUS.CONFLICT) {
        console.log(`이메일 중복 오류: ${data.message}`);
        console.log(ERROR_MESSAGES.DUPLICATE_EMAIL)
      }
      else if (res.status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        console.log(`DB오류: ${data.message}`);
        alert(ERROR_MESSAGES.SERVER);
      }
      else {
        console.log(`기타 오류: ${data.message}`);
        alert(`오류 발생: ${data.message || '알 수 없는 오류'}`);
      }

      // 페이지 새로고침 로그 확인할 땐 개발자도구 -> console/network preserve log 켜서 안날라가게 막아야함
      window.location.reload();
    } catch (error) {
      console.error("네트워크 오류: ", error);
      alert(`${ERROR_MESSAGES.NETWORK}: ${error.message}`);
    }
  }, [email, password, name, weight, dailyCaffeineLimit, startLoading, registerUser]);


  return (
    <>
      <form onSubmit={handleSignUp}>
        <h1>회원가입 테스트 폼</h1>
        <label>이메일</label>
        <input
          type='text'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>비밀번호</label>
        <input
          type='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>이름</label>
        <input
          type='text'
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>몸무게</label>
        <input
          type='number'
          id='weight'
          step="0.1" // float으로 받아서 이거 해줘야함
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <label>일일 카페인 제한</label>
        <input
          type='number'
          id='dailyCaffeineLimit'
          value={dailyCaffeineLimit}
          onChange={(e) => setDailyCaffeineLimit(e.target.value)}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? '처리 중...' : '회원가입'}
        </button>
      </form>
    </>
  )
}

export default SignUp
