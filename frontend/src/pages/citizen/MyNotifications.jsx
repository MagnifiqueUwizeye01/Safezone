import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import NotificationList from '../../components/notifications/NotificationList';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Alert from '../../components/common/Alert';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';
import { Bell } from 'lucide-react';

const MyNotifications = () => {
  const { user } = useAuth();
  const { notifications, loading, markAsRead, markAllAsRead, fetchNotifications } = useNotification();
  const [filter, setFilter] = useState('all');
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <Bell className="w-8 h-8 text-emerald-600" />
                  My Notifications
                </h1>
                <p className="text-gray-600">View and manage your notifications</p>
              </div>
              {unreadCount > 0 && (
                <Button variant="primary" size="md" onClick={handleMarkAllAsRead}>
                  Mark All as Read
                </Button>
              )}
            </div>
          </div>

          {error && (
            <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
          )}

          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'read'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('read')}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {filteredNotifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">No {filter === 'all' ? '' : filter} notifications</p>
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
      </div>
    </Layout>
  );
};

export default MyNotifications;

