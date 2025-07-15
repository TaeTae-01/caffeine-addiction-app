import React, { useEffect, useState } from 'react';

function Status() {

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('AccessToken'));
  
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

  const refreshToken = async (e) => {
    try {
      console.log('===토큰 갱신 시작===');
      console.log('현재 AccessToken:', localStorage.getItem('AccessToken'));
      console.log('요청 URL: http://localhost:8080/api/auth/refresh');
      console.log('요청 메서드: POST');
      console.log('credentials: include (쿠키 자동 전송)');

      const res = await fetch(
        'http://localhost:8080/api/auth/refresh',
        {
          method: 'POST',
          credentials: 'include',
        }
      )

      console.log('응답 상태 코드:', res.status);
      console.log('응답 상태 텍스트:', res.statusText);

      const data = await res.json();
      console.log('응답 데이터: ', data);

      // 응답 코드별 처리
      if (res.status === 200 && data.status === 'SU') {
        // 성공 - 새로운 토큰 저장
        console.log('토큰 갱신 성공');
        console.log('새로운 AccessToken:', data.newToken);
        
        localStorage.setItem('AccessToken', data.newToken);
        setIsLoggedIn(true);
        
        console.log('LocalStorage에 새 토큰 저장 완료');
        alert('토큰 갱신이 성공적으로 완료되었습니다!');
        
      } else if (res.status === 403 && data.status === 'IRT') {
        // 잘못된 Refresh Token
        console.error('잘못된 Refresh Token');
        console.error('메시지:', data.message);
        
        localStorage.removeItem('AccessToken');
        setIsLoggedIn(false);
        
        alert('잘못된 토큰입니다. 다시 로그인해주세요.');
        
      } else if (res.status === 401 && data.status === 'ERT') {
        // 만료된 Refresh Token
        console.error('만료된 Refresh Token');
        console.error('메시지:', data.message);
        
        localStorage.removeItem('AccessToken');
        setIsLoggedIn(false);
        
        alert('토큰이 만료되었습니다. 다시 로그인해주세요.');
        
      } else {
        // 기타 오류
        console.error('상태 코드:', res.status);
        console.error('응답 데이터:', data);
        
        alert(`토큰 갱신 실패: ${data.message || '알 수 없는 오류'}`);
      }
    }
    catch (error) {
      console.error('오류 타입:', error.name);
      console.error('오류 메시지:', error.message);
      console.error('전체 오류:', error);
      alert('오류 발생!!');
    }
  }


  return (
    <>
      <h3>Local Storage 토큰: {localStorage.getItem('AccessToken')}</h3>
      <button onClick={refreshToken}>토큰 갱신</button>  
    </>
  )
}

export default Status
