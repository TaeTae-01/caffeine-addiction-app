import React, { useCallback, useEffect, useState } from 'react';
import { API_ENDPOINTS, apiCall } from '../../config/api';
import useLoading from '../../hooks/useLoading';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../config/constants';

function Token() {
  // 근데 나중에 로그인 상태 감지할 땐 AccessToken보다 user가 못보는 refresh Token으로 상태 확인하는게 더 좋지 않을까..?
  // 만약에 유저가 local storage 접근해서 토큰 삭제해버리면 로그아웃 되버리는거임
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('AccessToken'));
  const [isLoading, startLoading] = useLoading();

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

  const userToken = useCallback(async (credential) => {
    return apiCall(API_ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      credentials: 'include',
    });
  }, []);

  const getToken = useCallback(async (e) => {
    try {
      console.log('===토큰 갱신 시작===');
      console.log('현재 AccessToken:', localStorage.getItem('AccessToken'));
      console.log('요청 URL: http://localhost:8080/api/auth/refresh');
      console.log('요청 메서드: POST');
      console.log('credentials: include (쿠키 자동 전송)');

      const res = await startLoading(userToken());

      console.log('응답 상태 코드:', res.status);
      console.log('응답 상태 텍스트:', res.statusText);

      const data = await res.json();
      console.log('응답 데이터: ', data);

      // 응답 코드별 처리
      if (res.status === HTTP_STATUS.OK) {
        // 성공 - 새로운 토큰 저장
        console.log('토큰 갱신 성공');
        console.log('새로운 AccessToken:', data.newToken);
        
        localStorage.setItem('AccessToken', data.newToken);
        setIsLoggedIn(true);
        
        console.log('LocalStorage에 새 토큰 저장 완료');
        alert('토큰 갱신이 성공적으로 완료되었습니다!');
        
      } else if (res.status === HTTP_STATUS.FORBIDDEN) {
        // 잘못된 Refresh Token
        console.error('잘못된 Refresh Token');
        console.error('메시지:', data.message);
        console.log('오류 상세:', data);        
        
        localStorage.removeItem('AccessToken');
        setIsLoggedIn(false);
        
        alert(ERROR_MESSAGES.INVALID_TOKEN);
        
      } else if (res.status === HTTP_STATUS.UNAUTHORIZED) {
        // 만료된 Refresh Token
        console.error('만료된 Refresh Token');
        console.error('메시지:', data.message);
        console.log('오류 상세:', data);
        
        localStorage.removeItem('AccessToken');
        setIsLoggedIn(false);
        
        alert(ERROR_MESSAGES.TOKEN_EXPIRED);
        
      } else {
        // 기타 오류
        console.log(`토큰갱신 실패 (${res.status}):`, data.status);
        console.log('서버 응답:', data);
        alert(`토큰 갱신 실패: ${data.message || '알 수 없는 오류'}`);
      }

      // 페이지 새로고침
      window.location.reload();

    } catch (error) {
      console.log('=== 네트워크 오류 발생 ===');
      console.error('오류 타입:', error.name);
      console.error('오류 메시지:', error.message);
      console.error('전체 오류 객체:', error);
      alert(`${ERROR_MESSAGES.NETWORK}: ${error.message}`);
    };
  }, []);

  return (
    <>
      <h3>Local Storage 토큰: {localStorage.getItem('AccessToken')}</h3>
      <button onClick={getToken}>토큰 갱신</button>  
    </>
  )
}

export default Token
