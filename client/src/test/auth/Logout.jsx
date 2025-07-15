function Logout() {

  const handleLogout = async (e) => {
    
    try {
      console.log('=== 로그아웃 시작 ===');
      
      // 토큰이 로컬 스토리지에 있는지 체크
      const AccessToken = localStorage.getItem('AccessToken');
      
      // 현재 쿠키 상태 확인
      console.log('현재 브라우저 쿠키:', document.cookie);
      
      // 현재 시간과 토큰 정보 확인
      if (AccessToken) {
        try {
          const tokenParts = AccessToken.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('토큰 페이로드:', payload);
          console.log('현재 시간 (초):', Math.floor(Date.now() / 1000));
          console.log('토큰 만료 시간:', payload.exp);
          console.log('토큰 남은 시간 (분):', (payload.exp - Math.floor(Date.now() / 1000)) / 60);
        } catch (tokenError) {
          console.log('토큰 파싱 오류:', tokenError);
        }
      }

      if (!AccessToken) {
        alert('이미 로그아웃 상태');
        return;
      }

      console.log('Access Token 확인:', AccessToken);

      // 요청 헤더 정보 출력
      console.log('요청 정보:');
      console.log('- URL:', 'http://localhost:8080/api/auth/logout');
      console.log('- Method:', 'POST');
      console.log('- Authorization:', `Bearer ${AccessToken}`);
      console.log('- Credentials:', 'include (쿠키 자동 포함)');
      console.log('- Content-Type:', 'application/json');

      // logout API 요청 날리기
      const res = await fetch(
        'http://localhost:8080/api/auth/logout',
        {
          method: 'POST',
          credentials: 'include', // 이거 해야 쿠키 추가됨
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AccessToken}`,
          },
        }
      );

      console.log('=== 로그아웃 응답 정보 ===');
      console.log('응답 상태 코드:', res.status);
      console.log('응답 상태 텍스트:', res.statusText);
      console.log('응답 헤더:', Object.fromEntries(res.headers.entries()));

      const data = await res.json();
      console.log('응답 데이터:', data);

      if (res.status === 200) {
        console.log('로그아웃 성공!');
        console.log('서버 응답:', data);
      
        localStorage.removeItem('AccessToken');
        
        alert('로그아웃되었습니다.');
        
      } else if (res.status === 403) {
        console.log('유효하지 않은 토큰 (403)');
        console.log('서버 응답:', data);
        
        localStorage.removeItem('AccessToken'); // 올바른 키로 삭제
        alert('토큰이 유효하지 않습니다. 다시 로그인해주세요.');
        
      } else if (res.status === 401) {
        console.log('인증 실패 (401)');
        console.log('서버 응답:', data);
        
        localStorage.removeItem('AccessToken');
        alert('인증이 만료되었습니다. 다시 로그인해주세요.');
        
      } else {
        console.log(`로그아웃 실패 (${res.status}):`, data.status);
        console.log('서버 응답:', data);
        console.log('서버 오류 메시지:', data.message);
        alert(`로그아웃 중 오류가 발생했습니다. (${res.status}: ${data.message})`);
      }
      
      console.log('=== 로그아웃 과정 종료 ===');
      
    } catch (error) {
      console.log('=== 로그아웃 네트워크 오류 ===');
      console.error('오류 타입:', error.name);
      console.error('오류 메시지:', error.message);
      console.error('전체 오류 객체:', error);
      
      // 네트워크 오류 시에도 로컬 토큰 삭제
      localStorage.removeItem('AccessToken');
      alert(`네트워크 오류가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <>
      <h1>로그아웃 테스트 폼</h1>
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
        <p><strong>현재 Access Token:</strong> {localStorage.getItem('AccessToken') ? '있음' : '없음'}</p>
        <p><strong>현재 쿠키:</strong> {document.cookie || '없음'}</p>
        <p><strong>로그인 상태:</strong> {localStorage.getItem('AccessToken') ? '로그인됨' : '로그아웃됨'}</p>
      </div>
      <button onClick={handleLogout} disabled={!localStorage.getItem('AccessToken')}>
        로그아웃
      </button>
    </>
  );
}

export default Logout;
