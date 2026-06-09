import React from 'react';
import NotificationItem from './NotificationItem';
import { X } from 'lucide-react';

const NotificationList = ({
  notifications = [],
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  return (
    <div className="divide-y divide-gray-100">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
};

export default NotificationList;

