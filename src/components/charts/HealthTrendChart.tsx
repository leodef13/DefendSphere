import React from 'react';

interface HealthData {
  date: string;
  health: number;
}

interface HealthTrendChartProps {
  data: HealthData[];
}

const HealthTrendChart: React.FC<HealthTrendChartProps> = ({ data }) => {
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
            
            return (
              <g key={index}>
                {/* Тень точки */}
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="6"
                  fill="rgba(0,0,0,0.1)"
                  className="transition-all duration-300"
                />
                {/* Основная точка */}
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all duration-300 hover:r-6"
                />
                {/* Значение */}
                <text
                  x={`${x}%`}
                  y={`${y - 15}%`}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-700"
                >
                  {item.health}%
                </text>
              </g>
            );
          })}
        </svg>
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