import React, { useState } from 'react';
import '../styles/Home.css';

const Home = () => {
  const [caffeineAmount, setCaffeineAmount] = useState(180);
  const [cupsToday, setCupsToday] = useState(3);
  const [weeklyAverage, setWeeklyAverage] = useState(4.2);

  const remainingCups = 2.3;
  const reducedAmount = 90;
  const hoursUntilReduction = 6;

  const handleAddCaffeine = () => {
    // 카페인 추가 로직
    console.log('카페인 섭취 버튼 클릭');
  };

  const handleUserClick = () => {
    // 사용자 버튼 클릭 로직
    console.log('사용자 버튼 클릭');
  };

  return (
    <div className="caffeine-tracker">
      <header className="app-header">
        <h1>카페인 추적 앱 - 매일 관리</h1>
      </header>

      <div className="main-content">
        <div className="title-section">
          <h2>카페인 추적</h2>
          <span className="sparkle">☀️</span>
          <button className="user-button" onClick={handleUserClick}>
            사용자
          </button>
        </div>

        <div className="coffee-status">
          <div className="coffee-icon-container">
            <div className="coffee-icon">☕</div>
            <div className="remaining-cups">
              <span className="cups-number">{remainingCups}</span>
              <span className="cups-text">잔 더 가능</span>
            </div>
          </div>
        </div>

        <div className="caffeine-info">
          <div className="current-caffeine">
            <span className="label">🏷️ 체내 카페인:</span>
            <span className="amount">{caffeineAmount}mg</span>
          </div>
          <div className="time-info">
            ⏰ {hoursUntilReduction}시간 후 {reducedAmount}mg로 감소
          </div>
          <div className="status-message">
            "적정 수준이에요 👍"
          </div>
        </div>

        <button className="add-caffeine-button" onClick={handleAddCaffeine}>
          ☕ 카페인 섭취
        </button>

        <div className="statistics">
          <div className="stat-item">
            <div className="stat-label">오늘</div>
            <div className="stat-value">{cupsToday}잔</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">주간 평균</div>
            <div className="stat-value">{weeklyAverage}잔</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">다음</div>
            <div className="stat-value off">OFF</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
