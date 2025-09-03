import React from 'react';

interface ProblemData {
  label: string;
  value: number;
  color: string;
}

interface ProblemsOverviewProps {
  data: ProblemData[];
}

const ProblemsOverview: React.FC<ProblemsOverviewProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-4">
          {/* Круглешок */}
          <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
            {item.value}
          </div>
          
          {/* Описание */}
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{item.label}</div>
            <div className="text-xs text-gray-500">
              {item.value === 1 ? 'problem' : 'problems'}
            </div>
          </div>
          
          {/* Иконка в зависимости от типа проблемы */}
          <div className="w-8 h-8 flex items-center justify-center">
            {item.label.includes('Critical') && (
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            )}
            {item.label.includes('High') && (
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            )}
            {item.label.includes('Medium') && (
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            )}
            {item.label.includes('Low') && (
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            )}
            {item.label.includes('Assets') && (
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProblemsOverview;