import React from 'react';

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

  return (
    <div className="relative">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
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
        <div className="text-3xl font-bold" style={{ color }}>
          {percentage}%
        </div>
        <div className="text-sm text-gray-500 text-center">
          Security<br />Health
        </div>
      </div>
    </div>
  );
};

export default SecurityHealthChart;