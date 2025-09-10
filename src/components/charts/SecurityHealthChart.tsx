import React, { useState } from 'react';

interface SecurityHealthChartProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

const SecurityHealthChart: React.FC<SecurityHealthChartProps> = ({ 
  percentage, 
  size = 200, 
  strokeWidth = 12 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Определяем цвет в зависимости от процента
  const getColor = (percent: number) => {
    if (percent >= 80) return '#10b981'; // green
    if (percent >= 60) return '#f59e0b'; // yellow
    if (percent >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const color = getColor(percentage);

  // Определяем статус в зависимости от процента
  const getStatus = (percent: number) => {
    if (percent >= 80) return 'Excellent';
    if (percent >= 60) return 'Good';
    if (percent >= 40) return 'Fair';
    return 'Critical';
  };

  const status = getStatus(percentage);

  return (
    <div 
      className="relative cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 transition-transform duration-300 group-hover:scale-105"
      >
        {/* Фоновый круг */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Прогресс */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Центральный текст */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold transition-all duration-300" style={{ color }}>
          {percentage}%
        </div>
        <div className="text-sm text-gray-500 text-center">
          Security<br />Health
        </div>
      </div>

      {/* Hover индикатор */}
      {isHovered && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg z-10">
          <div className="text-sm font-medium">Status: {status}</div>
          <div className="text-xs text-gray-300">Health Score: {percentage}%</div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityHealthChart;