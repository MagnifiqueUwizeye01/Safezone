import React from 'react';
import { formatDateTime } from '../../utils/formatters';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const handleClick = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
      onClick={handleClick}
    >
      <div className="notification-content">
        <h4 className="notification-title">{notification.title}</h4>
        <p className="notification-message">{notification.message}</p>
        <span className="notification-time">
          {formatDateTime(notification.createdAt)}
        </span>
      </div>
      {!notification.isRead && <div className="notification-dot"></div>}
    </div>
  );
};

export default NotificationItem;

