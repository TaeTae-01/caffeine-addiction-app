import React, { useEffect, useState } from 'react';

function Status() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        setIsLoggedIn(!!e.newValue);
        console.log("토큰값 변화 감지");
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 정리 함수
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  return (
    <>
    <h1>로그인 상태: {isLoggedIn ? "로그인" : "로그아웃"}</h1>
    <h2>Local Storage 토큰: { localStorage.getItem('token') }</h2>      
    </>
  )
}

export default Status
