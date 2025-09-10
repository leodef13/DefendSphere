import React, { useState } from 'react';

interface CriticalLevelData {
  element: string;
  green: number;
  yellow: number;
  red: number;
}

interface CriticalLevelsChartProps {
  data: CriticalLevelData[];
}

const CriticalLevelsChart: React.FC<CriticalLevelsChartProps> = ({ data }) => {
  const [hoveredElement, setHoveredElement] = useState<number | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<{element: number, segment: string} | null>(null);
  const maxValue = Math.max(...data.map(d => d.green + d.yellow + d.red));

  return (
    <div className="w-full">
      {/* График */}
      <div className="space-y-4">
        {data.map((item, index) => {
          const total = item.green + item.yellow + item.red;
          const greenWidth = (item.green / maxValue) * 100;
          const yellowWidth = (item.yellow / maxValue) * 100;
          const redWidth = (item.red / maxValue) * 100;
          const isElementHovered = hoveredElement === index;

          return (
            <div 
              key={index} 
              className="space-y-2 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 cursor-pointer group"
              onMouseEnter={() => setHoveredElement(index)}
              onMouseLeave={() => setHoveredElement(null)}
            >
              {/* Название элемента */}
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium transition-colors ${isElementHovered ? 'text-gray-700' : 'text-gray-900'}`}>
                  {item.element}
                </span>
                <span className="text-xs text-gray-500">Total: {total}</span>
              </div>

              {/* Полоски уровней */}
              <div className="flex h-6 rounded-lg overflow-hidden shadow-sm">
                {/* Зеленый уровень */}
                <div 
                  className="bg-green-500 transition-all duration-500 ease-out cursor-pointer hover:bg-green-600"
                  style={{ width: `${greenWidth}%` }}
                  title={`Green: ${item.green}`}
                  onMouseEnter={() => setHoveredSegment({element: index, segment: 'green'})}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  {greenWidth > 10 && (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{item.green}</span>
                    </div>
                  )}
                </div>

                {/* Желтый уровень */}
                <div 
                  className="bg-yellow-500 transition-all duration-500 ease-out cursor-pointer hover:bg-yellow-600"
                  style={{ width: `${yellowWidth}%` }}
                  title={`Yellow: ${item.yellow}`}
                  onMouseEnter={() => setHoveredSegment({element: index, segment: 'yellow'})}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  {yellowWidth > 10 && (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{item.yellow}</span>
                    </div>
                  )}
                </div>

                {/* Красный уровень */}
                <div 
                  className="bg-red-500 transition-all duration-500 ease-out cursor-pointer hover:bg-red-600"
                  style={{ width: `${redWidth}%` }}
                  title={`Red: ${item.red}`}
                  onMouseEnter={() => setHoveredSegment({element: index, segment: 'red'})}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  {redWidth > 10 && (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{item.red}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Детализация */}
              <div className="flex justify-between text-xs text-gray-500">
                <span className={`transition-colors ${hoveredSegment?.element === index && hoveredSegment?.segment === 'green' ? 'text-green-600 font-medium' : ''}`}>
                  Green: {item.green}
                </span>
                <span className={`transition-colors ${hoveredSegment?.element === index && hoveredSegment?.segment === 'yellow' ? 'text-yellow-600 font-medium' : ''}`}>
                  Yellow: {item.yellow}
                </span>
                <span className={`transition-colors ${hoveredSegment?.element === index && hoveredSegment?.segment === 'red' ? 'text-red-600 font-medium' : ''}`}>
                  Red: {item.red}
                </span>
              </div>

              {/* Hover индикатор для элемента */}
              {isElementHovered && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg z-10">
                  <div className="text-sm font-medium">{item.element}</div>
                  <div className="text-xs text-gray-300">
                    Total: {total} • Green: {item.green} • Yellow: {item.yellow} • Red: {item.red}
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Легенда */}
      <div className="mt-6 flex justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded transition-all duration-300 hover:scale-125 cursor-pointer"></div>
          <span className="text-xs text-gray-600">Low Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded transition-all duration-300 hover:scale-125 cursor-pointer"></div>
          <span className="text-xs text-gray-600">Medium Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded transition-all duration-300 hover:scale-125 cursor-pointer"></div>
          <span className="text-xs text-gray-600">High Risk</span>
        </div>
      </div>

      {/* Статистика */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100">
        <div className="text-xs font-medium text-gray-700 mb-2">Summary</div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="transition-all duration-300 hover:scale-105">
            <div className="text-lg font-bold text-green-600">
              {data.reduce((sum, item) => sum + item.green, 0)}
            </div>
            <div className="text-xs text-gray-500">Low Risk</div>
          </div>
          <div className="transition-all duration-300 hover:scale-105">
            <div className="text-lg font-bold text-yellow-600">
              {data.reduce((sum, item) => sum + item.yellow, 0)}
            </div>
            <div className="text-xs text-gray-500">Medium Risk</div>
          </div>
          <div className="transition-all duration-300 hover:scale-105">
            <div className="text-lg font-bold text-red-600">
              {data.reduce((sum, item) => sum + item.red, 0)}
            </div>
            <div className="text-xs text-gray-500">High Risk</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriticalLevelsChart;