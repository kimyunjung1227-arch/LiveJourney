import React from 'react';

const LiveJourneyLogo = ({ size = 80, showText = true, className = '' }) => {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* 나침반 + 카메라 셔터 결합 로고 */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 배경 - 오렌지 */}
        <rect 
          x="0" 
          y="0" 
          width="200" 
          height="200" 
          rx="45" 
          fill="#ff6b35"
        />
        
        {/* 메인 심볼: 나침반 + 셔터 결합 */}
        <g transform="translate(100, 100)">
          
          {/* 나침반 외부 원 */}
          <circle 
            cx="0" 
            cy="0" 
            r="70" 
            stroke="white" 
            strokeWidth="8" 
            fill="none"
          />
          
          {/* 셔터 날개들 (8개) */}
          <g opacity="0.9">
            <path d="M 0 -50 L 15 -15 L -15 -15 Z" fill="white"/>
            <path d="M 35 -35 L 15 -15 L 15 15 Z" fill="white"/>
            <path d="M 50 0 L 15 -15 L 15 15 Z" fill="white"/>
            <path d="M 35 35 L 15 15 L -15 15 Z" fill="white"/>
            <path d="M 0 50 L -15 15 L 15 15 Z" fill="white"/>
            <path d="M -35 35 L -15 15 L -15 -15 Z" fill="white"/>
            <path d="M -50 0 L -15 15 L -15 -15 Z" fill="white"/>
            <path d="M -35 -35 L -15 -15 L 15 -15 Z" fill="white"/>
          </g>
          
          {/* 중앙 원 (나침반 중심 + 셔터 중심) */}
          <circle 
            cx="0" 
            cy="0" 
            r="30" 
            fill="white"
          />
          
          {/* 방향 표시 (N) */}
          <text 
            x="0" 
            y="-55" 
            textAnchor="middle" 
            fill="white" 
            fontSize="18" 
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
          >
            N
          </text>
          
          {/* 셔터 버튼 중앙 */}
          <circle 
            cx="0" 
            cy="0" 
            r="18" 
            fill="#e85d22"
          />
        </g>
      </svg>
      
      {/* 텍스트 로고 */}
      {showText && (
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-4xl font-bold tracking-tight" style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #e85d22 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            LiveJourney
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 font-semibold">
            헛걸음 없는 여행
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveJourneyLogo;







