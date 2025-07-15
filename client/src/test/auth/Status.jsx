import React, { useEffect, useState } from 'react';

function Status() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('AccessToken');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'AccessToken') {
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
    <h3>Local Storage 토큰: { localStorage.getItem('AccessToken') }</h3>      
    </>
  )
}

export default Status
