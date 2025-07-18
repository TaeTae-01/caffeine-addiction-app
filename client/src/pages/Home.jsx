import React, { useCallback, useState, useRef, useMemo } from 'react';
import useLoading from '../hooks/useLoading';
import { API_ENDPOINTS, apiCall } from '../config/api';
import { ERROR_MESSAGES, HTTP_STATUS, STORAGE_KEYS } from '../config/constants';

// 모달 컴포넌트
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 - 블러 효과 추가 */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 dark:bg-gray-800">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold dark:text-gray-400 dark:hover:text-gray-200"
        >
          ×
        </button>
        
        {/* 모달 내용 */}
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// 로그인 폼 컴포넌트
const LoginForm = ({ onSwitchToSignUp, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, startLoading] = useLoading();

  const loginUser = useCallback((credential) => {
    return apiCall(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(credential)
    });
  }, []);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();

    const payload = { email, password };

    try {
      const res = await startLoading(loginUser(payload));
      const data = await res.json();

      if (res.status === HTTP_STATUS.OK) {
        if (data.token) {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.token);
        }
        alert('로그인 성공');
        onClose();
        window.location.reload();
      } else if (res.status === HTTP_STATUS.UNAUTHORIZED) {
        alert(ERROR_MESSAGES.UNAUTHORIZED);
      } else {
        alert(`로그인 실패: ${data.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert(`${ERROR_MESSAGES.NETWORK}: ${error.message}`);
    }
  }, [email, password, startLoading, loginUser, onClose]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        로그인
      </h2>
      
      <form onSubmit={handleLogin} className="space-y-4">
        {/* 이메일 입력 */}
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>

        {/* 회원가입 전환 버튼 */}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="w-full text-blue-500 hover:text-blue-700 text-sm font-medium dark:text-blue-400 dark:hover:text-blue-300"
        >
          회원이 되시면 카페인 정보가 저장됩니다!
        </button>
      </form>
    </div>
  );
};

// 회원가입 폼 컴포넌트
const SignUpForm = ({ onSwitchToLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
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
    e.preventDefault();

    // 비밀번호 확인 검증
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 숫자 필드 검증
    if (isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
      alert('올바른 몸무게를 입력해주세요.');
      return;
    }

    if (isNaN(parseInt(dailyCaffeineLimit)) || parseInt(dailyCaffeineLimit) <= 0) {
      alert('올바른 카페인 제한량을 입력해주세요.');
      return;
    }

    const payload = {
      email,
      password,
      name,
      weight: parseFloat(weight),
      dailyCaffeineLimit: parseInt(dailyCaffeineLimit)
    };

    try {
      const res = await startLoading(registerUser(payload));
      const data = await res.json();

      if (res.status === HTTP_STATUS.OK) {
        alert('회원가입 성공');
        onSwitchToLogin();
      } else if (res.status === HTTP_STATUS.BAD_REQUEST) {
        alert(`유효성 검사 오류: ${data.message}`);
      } else if (res.status === HTTP_STATUS.CONFLICT) {
        alert(`이메일 중복 오류: ${data.message}`);
      } else {
        alert(`오류 발생: ${data.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      alert(`${ERROR_MESSAGES.NETWORK}: ${error.message}`);
    }
  }, [email, password, passwordConfirm, name, weight, dailyCaffeineLimit, startLoading, registerUser, onSwitchToLogin]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        회원가입
      </h2>
      
      <form onSubmit={handleSignUp} className="space-y-4">
        {/* 이메일 */}
        <div>
          <label htmlFor="signup-email" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
            이메일
          </label>
          <input
            type="email"
            id="signup-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label htmlFor="signup-password" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
            비밀번호
          </label>
          <input
            type="password"
            id="signup-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* 이름 */}
        <div>
          <label htmlFor="signup-name" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
            이름
          </label>
          <input
            type="text"
            id="signup-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* 몸무게 */}
        <div>
          <label htmlFor="signup-weight" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
            몸무게 (kg)
          </label>
          <input
            type="number"
            id="signup-weight"
            step="0.1"
            min="1"
            max="500"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={isLoading}
            required
            onKeyDown={(e) => {
              // 문자 입력 차단
              if (!/[0-9.]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* 일일 카페인 제한 */}
        <div>
          <label htmlFor="signup-caffeine" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
            일일 카페인 제한 (mg)
          </label>
          <input
            type="number"
            id="signup-caffeine"
            min="1"
            max="2000"
            value={dailyCaffeineLimit}
            onChange={(e) => setDailyCaffeineLimit(e.target.value)}
            disabled={isLoading}
            required
            onKeyDown={(e) => {
              // 문자 입력 차단 (정수만 허용)
              if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {isLoading ? '처리 중...' : '회원가입'}
        </button>

        {/* 로그인 전환 버튼 */}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full text-blue-500 hover:text-blue-700 text-sm font-medium dark:text-blue-400 dark:hover:text-blue-300"
        >
          계정이 있으신가요? 로그인하기
        </button>
      </form>
    </div>
  );
};

// 사용자 정보 컴포넌트
const UserInfoForm = ({ onClose }) => {
  const [isLoading, startLoading] = useLoading();
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [caffeineLimit, setCaffeineLimit] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const originalDataRef = useRef({});

  const updateUserState = useCallback((userData) => {
    if (userData.id !== id) setId(userData.id);
    if (userData.email !== email) setEmail(userData.email);
    if (userData.name !== name) setName(userData.name);
    if (userData.weight !== weight) setWeight(userData.weight);
    if (userData.dailyCaffeineLimit !== caffeineLimit)
      setCaffeineLimit(userData.dailyCaffeineLimit);
    
    setPassword('');
    originalDataRef.current = userData;
  }, [id, email, name, weight, caffeineLimit]);

  const fetchUserInfo = useCallback(async () => {
    try {
      const cached = localStorage.getItem('cachedUserInfo');
      if (cached) {
        updateUserState(JSON.parse(cached));
        return;
      }

      const res = await startLoading(
        apiCall(API_ENDPOINTS.AUTH.USERINFO, { method: 'GET' })
      );

      if (res.status === HTTP_STATUS.OK) {
        const data = await res.json();
        localStorage.setItem('cachedUserInfo', JSON.stringify(data.user));
        updateUserState(data.user);
      } else {
        console.error(`사용자 정보 요청 실패: ${res.status}`);
      }
    } catch (error) {
      console.error('사용자 정보 요청 오류:', error);
    }
  }, [startLoading, updateUserState]);

 const hasChanges = useMemo(() => {
    const original = originalDataRef.current;
    return (
      email !== original.email ||
      name !== original.name ||
      weight !== original.weight ||
      caffeineLimit !== original.dailyCaffeineLimit ||
      (password && password === passwordConfirm)
    );
  }, [email, name, weight, caffeineLimit, password, passwordConfirm]);

 const updateUserInfo = useCallback(async () => {
    const original = originalDataRef.current;
    const updatedData = {};
    
    if (password && password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
  
    if (email !== original.email) updatedData.email = email;
    if (password) updatedData.password = password;
    if (name !== original.name) updatedData.name = name;
    if (weight !== original.weight) updatedData.weight = weight;
    if (caffeineLimit !== original.dailyCaffeineLimit)
      updatedData.dailyCaffeineLimit = caffeineLimit;
    
    if (Object.keys(updatedData).length === 0) {
      return;
    }
  
    try {
      const res = await startLoading(
        apiCall(API_ENDPOINTS.AUTH.USEREDIT, {
          method: 'PATCH',
          body: JSON.stringify(updatedData),
        })
      );
  
      if (res.status === HTTP_STATUS.OK) {
        const newUserData = { ...original, ...updatedData };
        localStorage.setItem('cachedUserInfo', JSON.stringify(newUserData));
        updateUserState(newUserData);
        setPassword('');
        setPasswordConfirm('');
        alert('사용자 정보가 수정되었습니다.');
      } else {
        console.error(`사용자 정보 수정 실패: ${res.status}`);
      }
    } catch (error) {
      console.error('사용자 정보 수정 중 오류 발생:', error);
    }
  }, [email, password, passwordConfirm, name, weight, caffeineLimit, startLoading, updateUserState]);


  const handleLogout = useCallback(async () => {
    try {
      const res = await startLoading(
        apiCall(API_ENDPOINTS.AUTH.LOGOUT, {
          method: 'POST',
          credentials: 'include',
        })
      );

      if (res.status === HTTP_STATUS.OK || res.status === HTTP_STATUS.FORBIDDEN || res.status === HTTP_STATUS.UNAUTHORIZED) {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem('cachedUserInfo');
        alert('로그아웃되었습니다.');
        onClose();
        window.location.reload();
      } else {
        alert('로그아웃 중 오류가 발생했습니다.');
      }
    } catch (error) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem('cachedUserInfo');
      alert(`${ERROR_MESSAGES.NETWORK}: ${error.message}`);
    }
  }, [startLoading, onClose]);

  // 컴포넌트 마운트 시 사용자 정보 자동 로드
  React.useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  return (
  
    <div className="max-h-96 overflow-y-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        사용자 정보
      </h2>
      
      {/* 사용자 정보 표시 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 dark:bg-gray-700">
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="font-semibold text-gray-700 dark:text-gray-300 w-20">ID:</span>
            <span className="text-gray-900 dark:text-white">{id || '정보 없음'}</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-gray-700 dark:text-gray-300 w-20">이메일:</span>
            <span className="text-gray-900 dark:text-white">{email || '정보 없음'}</span>
          </div>
          <div className="flex">
            <span className="font-semibold text-gray-700 dark:text-gray-300 w-20">이름:</span>
            <span className="text-gray-900 dark:text-white">{name || '정보 없음'}</span>
          </div>
        </div>
      </div>

      {/* 정보 수정 폼 */}
      <div className="space-y-3">
        <div>
          <label className="block text-gray-700 text-xs font-bold mb-1 dark:text-gray-300">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-bold mb-1 dark:text-gray-300">
            새 비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-bold mb-1 dark:text-gray-300">
            비밀번호 확인
          </label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            disabled={isLoading}
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-bold mb-1 dark:text-gray-300">
            이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-bold mb-1 dark:text-gray-300">
            몸무게 (kg)
          </label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="500"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (!/[0-9.]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-bold mb-1 dark:text-gray-300">
            카페인 제한 (mg)
          </label>
          <input
            type="number"
            min="1"
            max="2000"
            value={caffeineLimit}
            onChange={(e) => setCaffeineLimit(e.target.value)}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex space-x-2 mt-6">
        <button
          onClick={updateUserInfo}
          disabled={isLoading || !hasChanges}
          className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? '수정 중...' : '정보 수정'}
        </button>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? '처리 중...' : '로그아웃'}
        </button>
      </div>
      <div> 이름: <span className="text-gray-900 dark:text-white">{userName || '정보 없음'}</span></div>

      {/* 정보 수정 폼 */}
      <div className="space-y-3">
        <div>
          <label className="block text-gray-700 text-xs font-bold mb-1 dark:text-gray-300">
            이메일
          </label>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            disabled={isLoading}
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-bold mb-1 dark:text-gray-300">
            새 비밀번호
          </label>
          <input
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            disabled={isLoading}
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-bold mb-1 dark:text-gray-300">
            비밀번호 확인
          </label>
          <input
            type="password"
            value={userPasswordConfirm}
            onChange={(e) => setUserPasswordConfirm(e.target.value)}
            disabled={isLoading}
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-bold mb-1 dark:text-gray-300">
            이름
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled={isLoading}
            className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex space-x-2 mt-6">
        <button
          onClick={editUserInfo}
          disabled={isLoading || !hasChanges}
          className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? '수정 중...' : '정보 수정'}
        </button>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? '처리 중...' : '로그아웃'}
        </button>
      </div>
    </div>
  );
};

// 메인 Home 컴포넌트
const Home = () => {
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('login'); // 'login', 'signup', 'userinfo'

  // 다크모드 상태 관리
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  // 로그인 상태 확인
  const isLoggedIn = !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  // 다크모드 토글 함수
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 모달 열기 함수
  const openModal = () => {
    if (isLoggedIn) {
      setModalContent('userinfo');
    } else {
      setModalContent('login');
    }
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 로그인/회원가입 전환 함수
  const switchToSignUp = () => {
    setModalContent('signup');
  };

  const switchToLogin = () => {
    setModalContent('login');
  };

  // 다크모드 초기 설정
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 모달 내용 렌더링
  const renderModalContent = () => {
    switch (modalContent) {
      case 'login':
        return <LoginForm onSwitchToSignUp={switchToSignUp} onClose={closeModal} />;
      case 'signup':
        return <SignUpForm onSwitchToLogin={switchToLogin} onClose={closeModal} />;
      case 'userinfo':
        return <UserInfoForm onClose={closeModal} />;
      default:
        return null;
    }
  };

  return (
    // 전체 컨테이너: 최대 너비, 중앙 정렬, 배경색, 최소 높이, 폰트, 그림자, 둥근 모서리
    <div className="max-w-sm md:max-w-md mx-auto bg-white min-h-screen font-sans shadow-lg rounded-lg overflow-hidden dark:bg-gray-900 dark:text-white">
      {/* 메인 콘텐츠 영역: 패딩 */}
      <div className="p-5">
        {/* 제목 섹션: flexbox, 아이템 중앙 정렬, 하단 마진, 양쪽 정렬 */}
        <div className="flex items-center mb-10 justify-between">
          {/* 제목: 폰트 크기, 폰트 두께, 마진 없음 */}
          <h2 className="text-xl font-semibold m-0 text-gray-900 dark:text-white">카페인 중독</h2>
          
          {/* 버튼 컨테이너: flexbox, 아이템 중앙 정렬, 간격 */}
          <div className="flex items-center gap-2">
            {/* 다크모드 토글 버튼: 폰트 크기, 커서, 호버 시 크기 확대, 전환 효과 */}
            <button
              className="text-xl cursor-pointer hover:scale-110 transition-transform"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
            
            {/* 사용자 버튼: 배경색, 텍스트 색상, 테두리 없음, 패딩, 둥근 모서리, 폰트 크기, 커서 */}
            {/* 호버 시 배경색 변경 및 전환 효과 */}
            <button
              className="bg-amber-700 text-white border-none py-2 px-5 rounded-full text-sm cursor-pointer hover:bg-amber-800 transition-colors duration-200"
              onClick={openModal}
            >
              👤
            </button>
          </div>
        </div>

        {/* 커피 상태 섹션: flexbox, 중앙 정렬, 하단 마진 */}
        <div className="flex justify-center mb-10">
          {/* 커피 아이콘 컨테이너: 텍스트 중앙 정렬, 상대 위치, 너비/높이, 배경색, 둥근 모서리, flexbox 정렬 */}
          {/* 다크 모드 지원을 위해 dark:bg-gray-800 추가 */}
          <div className="text-center relative w-44 h-44 bg-gray-100 rounded-full flex flex-col items-center justify-center dark:bg-gray-800">
            {/* 커피 아이콘: 폰트 크기, 하단 마진 */}
            <div className="text-5xl mb-2">☕</div>
            
            {/* 남은 잔 수: flexbox, 아이템 기준선 정렬, 간격 */}
            <div className="flex items-baseline gap-1">
              {/* 잔 수 숫자: 폰트 크기, 폰트 두께, 색상 */}
              <span className="text-5xl font-semibold text-orange-500">3</span>
              
              {/* 잔 수 텍스트: 폰트 크기, 텍스트 색상 */}
              <span className="text-base text-gray-600 dark:text-gray-400">잔 더 가능</span>
            </div>
          </div>
        </div>

        {/* 카페인 정보 섹션: 하단 마진, 텍스트 중앙 정렬 */}
        <div className="mb-8 text-center">
          {/* 현재 카페인: flexbox, 중앙 정렬, 아이템 중앙 정렬, 간격, 하단 마진, 폰트 크기 */}
          <div className="flex justify-center items-center gap-2 mb-2 text-base">
            <span className="text-gray-700 dark:text-gray-300">🏷️ 체내 카페인:</span>
            
            {/* 카페인 양: 폰트 두께 */}
            <span className="font-semibold text-gray-900 dark:text-white">100mg</span>
          </div>
          
          {/* 시간 정보: 텍스트 색상, 폰트 크기, 하단 마진 */}
          <div className="text-gray-600 text-sm mb-4 dark:text-gray-400">
            ⏰ 6시간 후 50mg로 감소
          </div>
          
          {/* 상태 메시지: 텍스트 색상, 폰트 크기, 폰트 두께, 상단 마진 */}
          <div className="text-green-500 text-base font-medium mt-4 dark:text-green-400">
            "적정 수준이에요 👍"
          </div>
        </div>

        {/* 카페인 섭취 버튼: 전체 너비, 배경색, 텍스트 색상, 테두리 없음, 패딩, 둥근 모서리, 폰트 크기, 폰트 두께, 커서 */}
        {/* 하단 마진, 전환 효과, 호버/액티브 시 배경색 변경 */}
        <button
          className="w-full bg-orange-500 text-white border-none py-4 rounded-full text-base font-semibold cursor-pointer mb-8 transition-colors duration-200 hover:bg-orange-600 active:bg-orange-700"
        >
          ☕ 카페인 섭취
        </button>

        {/* 통계 섹션: flexbox, 공간 분배, 상단 테두리, 상단 패딩 */}
        {/* 다크 모드 지원을 위해 dark:border-gray-700 추가 */}
        <div className="flex justify-between border-t border-gray-200 pt-5 dark:border-gray-700">
          {/* 통계 항목: 텍스트 중앙 정렬, flex-1로 공간 차지 */}
          <div className="text-center flex-1">
            {/* 통계 라벨: 폰트 크기, 텍스트 색상, 하단 마진 */}
            <div className="text-xs text-gray-500 mb-1 dark:text-gray-400">오늘</div>
            
            {/* 통계 값: 폰트 크기, 폰트 두께, 텍스트 색상 */}
            <div className="text-lg font-semibold text-gray-800 dark:text-white">1잔</div>
          </div>
          
          {/* 통계 항목: 텍스트 중앙 정렬, flex-1로 공간 차지 */}
          <div className="text-center flex-1">
            {/* 통계 라벨: 폰트 크기, 텍스트 색상, 하단 마진 */}
            <div className="text-xs text-gray-500 mb-1 dark:text-gray-400">주간 평균</div>
            
            {/* 통계 값: 폰트 크기, 폰트 두께, 텍스트 색상 */}
            <div className="text-lg font-semibold text-gray-800 dark:text-white">2잔</div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default Home;
