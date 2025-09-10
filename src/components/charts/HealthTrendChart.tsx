import React, { useState } from 'react';

interface HealthData {
  date: string;
  health: number;
}

interface HealthTrendChartProps {
  data: HealthData[];
}

const HealthTrendChart: React.FC<HealthTrendChartProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const maxHealth = Math.max(...data.map(d => d.health));
  const minHealth = Math.min(...data.map(d => d.health));
  const range = maxHealth - minHealth;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getColor = (health: number) => {
    if (health >= 80) return '#10b981'; // green
    if (health >= 60) return '#f59e0b'; // yellow
    if (health >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getStatus = (health: number) => {
    if (health >= 80) return 'Good';
    if (health >= 60) return 'Fair';
    if (health >= 40) return 'Poor';
    return 'Critical';
  };

  return (
    <div className="w-full h-64">
      {/* График */}
      <div className="relative h-48 w-full">
        {/* Сетка */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[100, 75, 50, 25, 0].map((value) => (
            <div key={value} className="flex items-center">
              <div className="w-8 text-xs text-gray-400 text-right pr-2">
                {value}%
              </div>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
          ))}
        </div>

        {/* Линия графика */}
        <svg className="absolute inset-0 w-full h-full" style={{ paddingLeft: '32px' }}>
          {/* Соединительные линии */}
          <polyline
            fill="none"
            stroke="#56a3d9"
            strokeWidth="2"
            points={data.map((item, index) => {
              const x = (index / (data.length - 1)) * (100 - 8); // 8% padding
              const y = 100 - ((item.health - minHealth) / range) * 100;
              return `${x},${y}`;
            }).join(' ')}
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Точки данных */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * (100 - 8);
            const y = 100 - ((item.health - minHealth) / range) * 100;
            const color = getColor(item.health);
            const isHovered = hoveredPoint === index;
            
            return (
              <g key={index}>
                {/* Тень точки */}
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={isHovered ? "8" : "6"}
                  fill="rgba(0,0,0,0.1)"
                  className="transition-all duration-300"
                />
                {/* Основная точка */}
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={isHovered ? "6" : "4"}
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all duration-300 cursor-pointer hover:r-6"
                  onMouseEnter={() => setHoveredPoint(index)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* Значение */}
                <text
                  x={`${x}%`}
                  y={`${y - 15}%`}
                  textAnchor="middle"
                  className={`text-xs font-medium fill-gray-700 transition-all duration-300 ${isHovered ? 'text-sm font-bold' : ''}`}
                >
                  {item.health}%
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover индикатор */}
        {hoveredPoint !== null && (
          <div 
            className="absolute bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg z-10 pointer-events-none"
            style={{
              left: `${32 + (hoveredPoint / (data.length - 1)) * (100 - 8)}%`,
              top: `${100 - ((data[hoveredPoint].health - minHealth) / range) * 100 - 60}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <div className="text-sm font-medium">{formatDate(data[hoveredPoint].date)}</div>
            <div className="text-xs text-gray-300">
              Health: {data[hoveredPoint].health}% ({getStatus(data[hoveredPoint].health)})
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          </div>
        )}
      </div>

      {/* Подписи осей */}
      <div className="flex justify-between mt-4 px-8">
        {data.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-600 font-medium">
              {formatDate(item.date)}
            </div>
          </div>
        ))}
      </div>

      {/* Легенда */}
      <div className="mt-4 flex justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Good (80%+)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Fair (60-79%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Poor (40-59%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-xs text-gray-600">Critical (&lt;40%)</span>
        </div>
      </div>
    </div>
  );
};

export default HealthTrendChart;