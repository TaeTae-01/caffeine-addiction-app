import React, { useState } from 'react';

function SignIn() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => { //async? 비동기로 이벤트 발생시 처리하는건가
    e.preventDefault(); // 입력한 정보로 보내야하니까 버튼 누르고 변경이 생기면 안됨
    // user가 입력한 데이터 검증
    console.log('=== 로그인 시작 ===');
    console.log('입력값 검증:');
    console.log('- 이메일:', email);
    console.log('- 비밀번호:', password ? '입력됨' : '비어있음');
    
    // 그냥 보내도 되는데 이렇게 묶어서 보내는게 깔끔함
    const payload = {
      email: email,
      password: password
    };

    // 어떤거 보내는지 로그
    console.log('전송할 페이로드:', payload);
    console.log('페이로드 JSON:', JSON.stringify(payload, null, 2));

    try { // 응답값 받을 변수 선언하고
      // await? 이건 정확하게 어떤 역할이지
      // fetch로 endpoint, method, headers, body
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
      );
      // 응답값을 저장하는 변수 (그런데 왜 await으로 하지?)
      // 응답값 확인하는 로그

      console.log('=== 응답 정보 ===');
      console.log('응답 상태 코드:', res.status);
      console.log('응답 상태 텍스트:', res.statusText);
      console.log('응답 헤더:', Object.fromEntries(res.headers.entries()));
      
      const data = await res.json();

      if (res.status === 200) {
        console.log('서버 응답 코드:', data.code);
        console.log('서버 응답 상태:', data.status);
        console.log('서버 응답 메시지:', data.message);
        alert("성공");

        // JWT 토큰이 있다면 저장
        if (data.token) {
          console.log('토큰 받음:', data.token);
          localStorage.setItem('AccessToken', data.token);
          console.log('토큰 저장 완료');
          console.log('리프레시 토큰은 브라우저가 자동으로 쿠키에 저장됩니다');
        }
                
        if (data.expirationTime) {
          console.log('토큰 만료 시간:', data.expirationTime);
        }
      }
      else if (res.status === 401) {
        console.log('오류 상세:', data);
        alert("실패");
      }
      else if (res.status === 500) {
        console.log('오류 상세:', data);
        alert("오류")
      }
    } catch (error) {
      console.log('=== 네트워크 오류 발생 ===');
      console.error('오류 타입:', error.name);
      console.error('오류 메시지:', error.message);
      console.error('전체 오류 객체:', error);
      alert(`네트워크 오류: ${error.message}`);
    }
  }


  return (
    <>
      {/* 버튼에도 온클릭 있는데 왜 폼에도 온 서브밋 해야함? */}
      <form onSubmit={handleSignUp}>
        <h1>로그인 테스트 폼</h1>
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
        <button onClick={handleSignUp}>로그인</button>
      </form>
    </>
  )
}

export default SignIn
