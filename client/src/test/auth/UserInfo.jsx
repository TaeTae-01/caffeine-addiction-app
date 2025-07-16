import { useCallback, useState } from 'react';
import useLoading from '../../hooks/useLoading';
import { API_ENDPOINTS, apiCall } from '../../config/api';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../config/constants';

function UserInfo() {
  const [isLoading, startLoading] = useLoading();
  const [errorMessage, setErrorMessage] = useState('');

  // 사용자 정보 상태
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userWeight, setUserWeight] = useState('');
  const [userCaffeineLimit, setUserCaffeineLimit] = useState('');

    const userData = useCallback((credential) => {
      return apiCall(API_ENDPOINTS.AUTH.USERINFO, {
        method: 'GET',
      });
    }, []);
  
  

  // 유저 정보 가져오기
const getUserInfo = useCallback(async () => {
  setErrorMessage('');

  console.log('=== 유저 정보 가져오기 요청 시작 ===');
  console.log('현재 localStorage AccessToken:', localStorage.getItem('AccessToken'));

  try {
    const res = await startLoading(userData());

    const data = await res.json();
      console.log('=== API 응답 도착 ===');
      console.log('상태 코드:', res.status);
      console.log('상태 텍스트:', res.statusText);
      console.log('응답 헤더:', Object.fromEntries(res.headers.entries()));

      if (res.status === HTTP_STATUS.OK) {
        console.log('성공 응답 데이터:', data);

        if (data && data.user) {
          setUserId(data.user.id);
          setUserEmail(data.user.email);
          setUserPassword(data.user.password);
          setUserName(data.user.name);
          setUserWeight(data.user.weight);
          setUserCaffeineLimit(data.user.dailyCaffeineLimit);
        } else {
          setErrorMessage('유효하지 않은 사용자 데이터입니다.');
          console.log('데이터에 user 필드가 없음:', data);
        }

      } else if (res.status === HTTP_STATUS.FORBIDDEN) {
        console.log('403 Forbidden 발생');
        setErrorMessage(ERROR_MESSAGES.INVALID_TOKEN);
      } else if (res.status === HTTP_STATUS.NOT_FOUND) {
        console.log('404 Not Found 발생');
        setErrorMessage('존재하지 않는 사용자입니다.');
      } else {
        console.log('기타 오류 상태 코드:', res.status);
        setErrorMessage(ERROR_MESSAGES.SERVER);
      }
    
  }

    catch (error) {
      console.log('=== 네트워크 오류 발생 ===');
      console.error('오류 타입:', error.name);
      console.error('오류 메시지:', error.message);
      console.error('전체 오류 객체:', error);
      setErrorMessage(`${ERROR_MESSAGES.NETWORK}: ${error.message}`);
    }
}, [startLoading]);


  return (
    <div>
      <h1>유저 정보 테스트</h1>
      {isLoading && <p>로딩 중...</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <div style={{
        margin: '20px 0',
        padding: '15px',
        backgroundColor: '#f5f5f5'
      }}>
        <p><strong>ID:</strong> {userId}</p>
        <p><strong>Email:</strong> {userEmail}</p>
        <p><strong>Password:</strong> {userPassword}</p>
        <p><strong>Name:</strong> {userName}</p>
        <p><strong>Weight:</strong> {userWeight} kg</p>
        <p><strong>Daily Caffeine Limit:</strong> {userCaffeineLimit} mg</p>
      </div>

      <button
        onClick={getUserInfo}
        disabled={isLoading}>
        유저 정보 가져오기
      </button>
    </div>
  );
}

export default UserInfo;
