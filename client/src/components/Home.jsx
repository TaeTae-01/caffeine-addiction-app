import React, { useState } from 'react';

const Home = () => {
  const [caffeineAmount, setCaffeineAmount] = useState(180);
  const [cupsToday, setCupsToday] = useState(3);
  const [weeklyAverage, setWeeklyAverage] = useState(4.2);

  const remainingCups = 2.3;
  const reducedAmount = 90;
  const hoursUntilReduction = 6;

  const handleAddCaffeine = () => {
    // 카페인 추가 로직
  };

  const handleUserClick = () => {
    // 사용자 버튼 클릭 로직
    // 모달창으로 user info edit 가능하게
  };

  return (
    // 전체 컨테이너: 최대 너비, 중앙 정렬, 배경색, 최소 높이, 폰트, 그림자, 둥근 모서리
    // 다크 모드 지원을 위해 dark:bg-gray-900 및 dark:text-white 추가
    <div className="max-w-sm md:max-w-md mx-auto bg-white min-h-screen font-sans shadow-lg rounded-lg overflow-hidden
                    dark:bg-gray-900 dark:text-white">

      {/* 메인 콘텐츠 영역: 패딩 */}
      <div className="p-5">
        {/* 제목 섹션: flexbox, 아이템 중앙 정렬, 하단 마진, 상대 위치 */}
        <div className="flex items-center mb-10 relative">
          {/* 제목: 폰트 크기, 폰트 두께, 마진 없음, flex-1로 공간 차지 */}
          <h2 className="text-xl font-semibold m-0 flex-1">카페인 중독</h2>
          {/* 스파클 아이콘: 폰트 크기, 왼쪽 마진 */}
          <span className="text-xl ml-2">☀️</span>
          {/* 사용자 버튼: 배경색, 텍스트 색상, 테두리 없음, 패딩, 둥근 모서리, 폰트 크기, 커서, 절대 위치 */}
          {/* 호버 시 배경색 변경 및 전환 효과 추가 */}
          <button
            className="bg-amber-700 text-white border-none py-2 px-5 rounded-full text-sm cursor-pointer absolute right-0
                       hover:bg-amber-800 transition-colors duration-200"
            onClick={handleUserClick}
          >
            👤
          </button>
        </div>

        {/* 커피 상태 섹션: flexbox, 중앙 정렬, 하단 마진 */}
        <div className="flex justify-center mb-10">
          {/* 커피 아이콘 컨테이너: 텍스트 중앙 정렬, 상대 위치, 너비/높이, 배경색, 둥근 모서리, flexbox 정렬 */}
          {/* 다크 모드 지원을 위해 dark:bg-gray-800 추가 */}
          <div className="text-center relative w-44 h-44 bg-gray-100 rounded-full flex flex-col items-center justify-center
                          dark:bg-gray-800">
            {/* 커피 아이콘: 폰트 크기, 하단 마진 */}
            <div className="text-5xl mb-2">☕</div>
            {/* 남은 잔 수: flexbox, 아이템 기준선 정렬, 간격 */}
            <div className="flex items-baseline gap-1">
              {/* 잔 수 숫자: 폰트 크기, 폰트 두께, 색상 */}
              <span className="text-5xl font-semibold text-orange-500">{remainingCups}</span>
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
            <span className="font-semibold">{caffeineAmount}mg</span>
          </div>
          {/* 시간 정보: 텍스트 색상, 폰트 크기, 하단 마진 */}
          <div className="text-gray-600 text-sm mb-4 dark:text-gray-400">
            ⏰ {hoursUntilReduction}시간 후 {reducedAmount}mg로 감소
          </div>
          {/* 상태 메시지: 텍스트 색상, 폰트 크기, 폰트 두께, 상단 마진 */}
          <div className="text-green-500 text-base font-medium mt-4">
            "적정 수준이에요 👍"
          </div>
        </div>

        {/* 카페인 섭취 버튼: 전체 너비, 배경색, 텍스트 색상, 테두리 없음, 패딩, 둥근 모서리, 폰트 크기, 폰트 두께, 커서 */}
        {/* 하단 마진, 전환 효과, 호버/액티브 시 배경색 변경 */}
        <button
          className="w-full bg-orange-500 text-white border-none py-4 rounded-full text-base font-semibold cursor-pointer mb-8
                     transition-colors duration-200 hover:bg-orange-600 active:bg-orange-700"
          onClick={handleAddCaffeine}
        >
          ☕ 카페인 섭취
        </button>

        {/* 통계 섹션: flexbox, 공간 분배, 상단 테두리, 상단 패딩 */}
        {/* 다크 모드 지원을 위해 dark:border-gray-700 추가 */}
        <div className="flex justify-between border-t border-gray-200 pt-5 dark:border-gray-700">
          {/* 통계 항목: 텍스트 중앙 정렬, flex-1로 공간 차지 */}
          <div className="text-center flex-1">
            {/* 통계 라벨: 폰트 크기, 텍스트 색상, 하단 마진 */}
            <div className="text-xs text-gray-500 mb-1">오늘</div>
            {/* 통계 값: 폰트 크기, 폰트 두께, 텍스트 색상 */}
            <div className="text-lg font-semibold text-gray-800 dark:text-white">{cupsToday}잔</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-xs text-gray-500 mb-1">주간 평균</div>
            <div className="text-lg font-semibold text-gray-800 dark:text-white">{weeklyAverage}잔</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
