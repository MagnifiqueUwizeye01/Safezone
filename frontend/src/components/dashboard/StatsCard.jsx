import React from 'react';
import Card from '../common/Card';

const StatsCard = ({ title, value, icon, variant = 'primary', trend, subtitle }) => {
  const borderColors = {
    primary: 'border-l-blue-600',
    success: 'border-l-green-600',
    warning: 'border-l-yellow-600',
    danger: 'border-l-red-600',
    info: 'border-l-blue-400',
  };

  return (
    <Card className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 border-l-4 ${borderColors[variant] || borderColors.primary}`}>
      <div className="flex items-center justify-between">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1 ml-4">
          <h3 className="text-sm font-medium text-slate-600 mb-1">{title}</h3>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`text-xs font-medium mt-1 ${trend.type === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend.type === 'up' ? '↑' : '↓'} {trend.value}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;

