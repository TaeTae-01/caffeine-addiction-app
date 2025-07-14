import React, { useState } from 'react';

function SignUp() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
 
    const payload = {
      email: email,
      password: password,
      name: name,
      weight: parseFloat(weight) // API 설명서 보면 float으로 받으니까 number로 오는거 파싱 해줘야함, 그러면 type: number는 어떤값이 기본일까
    };

    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.status === 200) {
        console.log("성공 & 성공 DATA: " + data);
        alert("성공");
      }
      else if (res.status === 400) {
        console.log(`유효성 검사 오류: ${data}`);
        alert("유효성 검사 오류");
      }
      else if (res.status === 409) {
        console.log(`유효성 검사 오류: ${data}`);
        alert("유효성 검사 오류");
      }
      else if (res.status === 500) {
        console.log(`DB오류: ${data}`);
        alert("DB오류");
      }
    } catch (error) {
      console.error("오류: ", error);
    }
  }


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

        <button onClick={handleSignUp}>회원가입</button>
      </form>
    </>
  )
}

export default SignUp
