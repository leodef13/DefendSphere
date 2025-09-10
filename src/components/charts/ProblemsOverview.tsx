import React, { useState } from 'react';

interface ProblemData {
  label: string;
  value: number;
  color: string;
}

interface ProblemsOverviewProps {
  data: ProblemData[];
}

const ProblemsOverview: React.FC<ProblemsOverviewProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Вычисляем общее количество для процентного отображения
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const percentage = totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0;
        const isHovered = hoveredIndex === index;

        return (
          <div 
            key={index} 
            className="flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 cursor-pointer group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Круглешок с анимацией */}
            <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300 group-hover:scale-110 shadow-lg`}>
              {item.value}
            </div>
            
            {/* Описание */}
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                {item.label}
              </div>
              <div className="text-xs text-gray-500">
                {item.value === 1 ? 'problem' : 'problems'} • {percentage}% of total
              </div>
            </div>
            
            {/* Иконка в зависимости от типа проблемы */}
            <div className="w-8 h-8 flex items-center justify-center">
              {item.label.includes('Critical') && (
                <div className="w-3 h-3 bg-red-500 rounded-full transition-all duration-300 group-hover:scale-125"></div>
              )}
              {item.label.includes('High') && (
                <div className="w-3 h-3 bg-orange-500 rounded-full transition-all duration-300 group-hover:scale-125"></div>
              )}
              {item.label.includes('Medium') && (
                <div className="w-3 h-3 bg-yellow-500 rounded-full transition-all duration-300 group-hover:scale-125"></div>
              )}
              {item.label.includes('Low') && (
                <div className="w-3 h-3 bg-green-500 rounded-full transition-all duration-300 group-hover:scale-125"></div>
              )}
              {item.label.includes('Assets') && (
                <div className="w-3 h-3 bg-blue-500 rounded-full transition-all duration-300 group-hover:scale-125"></div>
              )}
              {item.label.includes('Total') && (
                <div className="w-3 h-3 bg-gray-500 rounded-full transition-all duration-300 group-hover:scale-125"></div>
              )}
            </div>

            {/* Hover индикатор */}
            {isHovered && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg z-10">
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-gray-300">Count: {item.value} ({percentage}%)</div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProblemsOverview;