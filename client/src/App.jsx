import React, { useEffect, useState } from 'react';

function App() {

  const handleLogout = async (e) => {
    
    try {
      // 토큰이 로컬 스토리지에 있는지 체크
      const AccessToken = localStorage.getItem('AccessToken');

      if (!AccessToken) {
        alert('이미 로그아웃 상태');
      }

      const res = await fetch(
        'http://localhost:8080/api/auth/logout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AccessToken}`,
          },
        }
      )

      const data = await res.json();

      if (data.status === 200) {
        console.log('로그아웃 성공!');
        localStorage.removeItem('token');
        alert('로그아웃되었습니다.');
      } else if (data.status === 403) {
        console.log('유효하지 않은 토큰');
        localStorage.removeItem('token'); // 어차피 무효한 토큰이니 삭제
        alert('토큰이 유효하지 않습니다.');
      } else {
        console.log('로그아웃 실패:', data.status);
        alert('로그아웃 중 오류가 발생했습니다.');
      }
    }
    catch (error) {
      console.error('네트워크 오류:', error);
      localStorage.removeItem('token');
      alert('네트워크 오류가 발생했습니다.');
    }
  }
  

  return (
    <>
      <h1>로그아웃 테스트 폼</h1>
      <button onClick={handleLogout}>로그아웃</button>
    </>
  )
}

export default App
