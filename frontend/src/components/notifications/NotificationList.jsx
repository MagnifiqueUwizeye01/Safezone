import React from 'react';
import NotificationItem from './NotificationItem';
import Button from '../common/Button';

const NotificationList = ({
  notifications = [],
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notification-list">
      <div className="notification-list-header">
        <h3>Notifications</h3>
        {unreadCount > 0 && (
          <Button variant="link" size="sm" onClick={onMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
        <button className="notification-list-close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="notification-list-body">
        {notifications.length === 0 ? (
          <div className="notification-empty">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;

