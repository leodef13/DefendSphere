import React from 'react';

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

          return (
            <div key={index} className="space-y-2">
              {/* Название элемента */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{item.element}</span>
                <span className="text-xs text-gray-500">Total: {total}</span>
              </div>

              {/* Полоски уровней */}
              <div className="flex h-6 rounded-lg overflow-hidden">
                {/* Зеленый уровень */}
                <div 
                  className="bg-green-500 transition-all duration-500 ease-out"
                  style={{ width: `${greenWidth}%` }}
                  title={`Green: ${item.green}`}
                >
                  {greenWidth > 10 && (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{item.green}</span>
                    </div>
                  )}
                </div>

                {/* Желтый уровень */}
                <div 
                  className="bg-yellow-500 transition-all duration-500 ease-out"
                  style={{ width: `${yellowWidth}%` }}
                  title={`Yellow: ${item.yellow}`}
                >
                  {yellowWidth > 10 && (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{item.yellow}</span>
                    </div>
                  )}
                </div>

                {/* Красный уровень */}
                <div 
                  className="bg-red-500 transition-all duration-500 ease-out"
                  style={{ width: `${redWidth}%` }}
                  title={`Red: ${item.red}`}
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
                <span>Green: {item.green}</span>
                <span>Yellow: {item.yellow}</span>
                <span>Red: {item.red}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Легенда */}
      <div className="mt-6 flex justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">Low Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-xs text-gray-600">Medium Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-xs text-gray-600">High Risk</span>
        </div>
      </div>

      {/* Статистика */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs font-medium text-gray-700 mb-2">Summary</div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600">
              {data.reduce((sum, item) => sum + item.green, 0)}
            </div>
            <div className="text-xs text-gray-500">Low Risk</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600">
              {data.reduce((sum, item) => sum + item.yellow, 0)}
            </div>
            <div className="text-xs text-gray-500">Medium Risk</div>
          </div>
          <div>
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