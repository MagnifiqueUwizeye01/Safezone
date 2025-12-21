import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import NotificationList from '../../components/notifications/NotificationList';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';
import notificationService from '../../api/services/notificationService';

const MyNotifications = () => {
  const { user } = useAuth();
  const { notifications, loading, markAsRead, markAllAsRead, fetchNotifications } = useNotification();
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      setError('Failed to mark all as read');
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      setError('Failed to mark notification as read');
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Layout>
      <div className="my-notifications-page">
        <div className="page-header">
          <div className="header-content">
            <h1>
              <span className="bell-icon">🔔</span> My Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} unread</span>
            )}
          </div>
          <div className="header-actions">
            {unreadCount > 0 && (
              <Button variant="primary" size="sm" onClick={handleMarkAllAsRead}>
                Mark All as Read
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
        )}

        <div className="notifications-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Read
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <Spinner size="lg" />
            <p>Loading notifications...</p>
          </div>
        ) : (
          <div className="notifications-container">
            {filteredNotifications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔔</div>
                <p>No {filter === 'all' ? '' : filter} notifications</p>
              </div>
            ) : (
              <NotificationList
                notifications={filteredNotifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyNotifications;

