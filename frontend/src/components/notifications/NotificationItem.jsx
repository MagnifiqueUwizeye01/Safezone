import React from 'react';
import { formatDateTime } from '../../utils/formatters';
import { Bell, CheckCircle } from 'lucide-react';

const NotificationItem = ({ notification, onMarkAsRead, compact = false }) => {
  const handleClick = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.isRead ? 'bg-emerald-50/30' : ''
      } ${compact ? 'py-2' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-1 ${!notification.isRead ? 'text-emerald-600' : 'text-gray-400'}`}>
          {notification.isRead ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
              {notification.title || 'Notification'}
            </h4>
            {!notification.isRead && (
              <span className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-2"></span>
            )}
          </div>
          <p className={`text-gray-600 mt-1 ${compact ? 'text-sm' : 'text-base'} line-clamp-2`}>
            {notification.message || notification.content || 'No message'}
          </p>
          <span className="text-xs text-gray-500 mt-2 block">
            {formatDateTime(notification.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;

