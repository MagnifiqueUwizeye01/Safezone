import React, { useState } from 'react';
import { useNotification } from '../../hooks/useNotification';
import NotificationList from './NotificationList';

const NotificationBell = ({ unreadCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markAsRead, markAllAsRead } = useNotification();

  return (
    <div className="notification-bell-container">
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>
      {isOpen && (
        <NotificationList
          notifications={notifications}
          onClose={() => setIsOpen(false)}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
      )}
    </div>
  );
};

export default NotificationBell;

