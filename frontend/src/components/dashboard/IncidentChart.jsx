import React from 'react';

const IncidentChart = ({ data = [], type = 'bar' }) => {
  const maxValue = Math.max(...data.map(d => d.value || 0), 1);
  
  const getReportTypeLabel = (type) => {
    const typeMap = {
      THEFT: 'Theft',
      VIOLENCE: 'Violence',
      HARASSMENT: 'Harassment',
      VANDALISM: 'Vandalism',
      LOST_ITEM: 'Lost Item',
      SUSPICIOUS_ACTIVITY: 'Suspicious Activity',
      EMERGENCY: 'Emergency',
      OTHER: 'Other',
    };
    return typeMap[type] || type || 'Unknown';
  };
  
  return (
    <div className="w-full">
      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {getReportTypeLabel(item.label)}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{item.value || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IncidentChart;
