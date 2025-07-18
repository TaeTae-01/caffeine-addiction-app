import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import SignInTest from './SignInTest'
import SignUpTest from './SignUpTest'
import UserInfoTest from './UserInfoTest'
import LogoutTest from './LogoutTest'

function AuthTestPage() {
  const location = useLocation()
  const isSubTest = location.pathname !== '/test/auth'
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // 로그인 상태 확인
  useEffect(() => {

    // 로그인 상태를 감지하는 함수 (localStorage에 토큰 있는지 확인)
    const checkLoginStatus = () => {
      const token = localStorage.getItem('AccessToken')
      setIsLoggedIn(!!token)
    }
    
    // 로그인 상태 감지 init
    checkLoginStatus()
    
    // localStorage 변화 감지 (토큰 체크)
    const handleStorageChange = (e) => {
      if (e.key === 'AccessToken') {
        setIsLoggedIn(!!e.newValue)
      }
    }
    
    
    window.addEventListener('storage', handleStorageChange)
    
    // 페이지 포커스 시에도 체크 (같은 탭에서 변경 감지)
    const handleFocus = () => {
      checkLoginStatus()
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])
  
  if (isSubTest) {
    return (
      // 서브 테스트 페이지 전체 컨테이너: 최소 높이, 배경색, 다크 모드 지원
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* 공통 헤더: 흰색 배경, 그림자, 하단 경계선, 다크 모드 지원 */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          {/* 헤더 내용 컨테이너: 최대 너비, 중앙 정렬, 패딩 */}
          <div className="max-w-4xl mx-auto px-4 py-3">
            {/* 뒤로가기 링크: 파란색 텍스트, 호버 효과, 다크 모드 지원 */}
            <Link to="/test/auth" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              ← 테스트 메뉴로 돌아가기
            </Link>
          </div>
        </div>
        
        {/* 서브 라우트 각 API들 테스트하는 페이지로 이동*/}
        <Routes>
          <Route path="/signin" element={<SignInTest />} />
          <Route path="/signup" element={<SignUpTest />} />
          <Route path="/userinfo" element={<UserInfoTest />} />
          <Route path="/logout" element={<LogoutTest />} />
        </Routes>
      </div>
    )
  }
  
  return (
    // 메인 테스트 허브 전체 컨테이너: 최소 높이, 배경색, 패딩, 다크 모드 지원
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      {/* 메인 콘텐츠 컨테이너: 최대 너비, 중앙 정렬 */}
      <div className="max-w-4xl mx-auto">
        {/* 페이지 제목: 큰 글자, 굵게, 중앙 정렬, 하단 마진, 다크 모드 지원 */}
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          AUTH API TEST
        </h1>
        
        {/* 로그인 상태 표시 섹션 */}
        <div className="mb-8">
          {/* 로그인 상태 표시 박스: 패딩, 둥근 모서리, 중앙 정렬, 굵은 글씨, 조건부 배경색 */}
          <div className={`p-4 rounded-lg text-center font-semibold ${
            isLoggedIn 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {/* 상태 아이콘과 텍스트 컨테이너: 플렉스, 중앙 정렬, 간격 */}
            <div className="flex items-center justify-center gap-2">
              {/* 상태 아이콘: 큰 텍스트 */}
              <span className="text-xl">
                {isLoggedIn ? '🟢' : '🔴'}
              </span>
              {/* 상태 텍스트 */}
              <span>
                {isLoggedIn ? '로그인됨 - 토큰 및 로그아웃 테스트 가능' : '로그아웃됨 - 로그인 또는 회원가입 필요'}
              </span>
            </div>
            {/* 토큰 정보 표시 (로그인 상태일 때만): 상단 마진, 작은 글씨, 투명도 */}
            {isLoggedIn && (
              <div className="mt-2 text-sm opacity-75">
                AccessToken: {localStorage.getItem('AccessToken')?.substring(0, 20)}...
              </div>
            )}
          </div>
        </div>
        
        {/* 테스트 메뉴 그리드: 1열(모바일), 2열(데스크탑), 간격 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 로그인 테스트 카드: 블록 링크, 패딩, 흰색 배경, 둥근 모서리, 그림자, 호버 효과, 전환 효과, 다크 모드 지원 */}
          <Link to="/test/auth/signin" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            {/* 카드 제목: 큰 글씨, 굵게, 하단 마진, 파란색 */}
            <h2 className="text-xl font-semibold mb-2 text-blue-600">로그인 테스트</h2>
            {/* 카드 설명: 회색 텍스트, 다크 모드 지원 */}
            <p className="text-gray-600 dark:text-gray-300">로그인 API 및 토큰 발급 테스트</p>
          </Link>
          
          {/* 회원가입 테스트 카드: 블록 링크, 패딩, 흰색 배경, 둥근 모서리, 그림자, 호버 효과, 전환 효과, 다크 모드 지원 */}
          <Link to="/test/auth/signup" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            {/* 카드 제목: 큰 글씨, 굵게, 하단 마진, 초록색 */}
            <h2 className="text-xl font-semibold mb-2 text-green-600">회원가입 테스트</h2>
            {/* 카드 설명: 회색 텍스트, 다크 모드 지원 */}
            <p className="text-gray-600 dark:text-gray-300">회원가입 API 및 유효성 검사 테스트</p>
          </Link>
          
          {/* 사용자 정보 + 토큰 테스트 카드: 블록 링크, 패딩, 흰색 배경, 둥근 모서리, 그림자, 호버 효과, 전환 효과, 다크 모드 지원 */}
          <Link to="/test/auth/userinfo" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            {/* 카드 제목: 큰 글씨, 굵게, 하단 마진, 보라색 */}
            <h2 className="text-xl font-semibold mb-2 text-purple-600">사용자 정보 + 토큰 테스트</h2>
            {/* 카드 설명: 회색 텍스트, 다크 모드 지원 */}
            <p className="text-gray-600 dark:text-gray-300">사용자 정보 조회/수정, 토큰 갱신, 자동 리프레시 테스트</p>
          </Link>
          
          {/* 로그아웃 테스트 카드: 블록 링크, 패딩, 흰색 배경, 둥근 모서리, 그림자, 호버 효과, 전환 효과, 다크 모드 지원 */}
          <Link to="/test/auth/logout" className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            {/* 카드 제목: 큰 글씨, 굵게, 하단 마진, 빨간색 */}
            <h2 className="text-xl font-semibold mb-2 text-red-600">로그아웃 테스트</h2>
            {/* 카드 설명: 회색 텍스트, 다크 모드 지원 */}
            <p className="text-gray-600 dark:text-gray-300">로그아웃 API 및 토큰 무효화 테스트</p>
          </Link>
        </div>
        
        {/* 메인 앱 돌아가기 버튼 섹션: 상단 마진, 중앙 정렬 */}
        <div className="mt-8 text-center">
          {/* 메인 앱 돌아가기 버튼: 인라인 블록, 패딩, 배경색, 흰색 텍스트, 둥근 모서리, 호버 효과, 전환 효과 */}
          <Link to="/" className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            메인 앱으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AuthTestPage
