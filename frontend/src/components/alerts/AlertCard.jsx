import React from 'react';
import Badge from '../common/Badge';
import { formatDateTime } from '../../utils/formatters';
import { MapPin, Bell } from 'lucide-react';

const AlertCard = ({ alert, onClick }) => {
  const getAlertTypeColor = (type) => {
    const typeColors = {
      WARNING: 'warning',
      EMERGENCY: 'danger',
      INFO: 'info',
      SAFETY_ALERT: 'warning',
      COMMUNITY_UPDATE: 'success',
    };
    return typeColors[type] || 'secondary';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{alert.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{formatDateTime(alert.createdAt)}</p>
          </div>
        </div>
        <Badge variant={getAlertTypeColor(alert.type || alert.alertType)} pill className="flex-shrink-0">
          {(alert.type || alert.alertType)?.replace('_', ' ')}
        </Badge>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{alert.description || alert.message}</p>
      
      {alert.location && (
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          <span>{alert.location.name}</span>
        </div>
      )}
    </div>
  );
};

export default AlertCard;
