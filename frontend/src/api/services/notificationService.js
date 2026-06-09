import apiClient from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';

export const notificationService = {
  // Get all notifications
  getAllNotifications: async () => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION.ALL);
    return response.data;
  },

  // Get notification by ID
  getNotificationById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION.BY_ID(id));
    return response.data;
  },

  // Create notification
  createNotification: async (notificationData) => {
    const response = await apiClient.post(API_ENDPOINTS.NOTIFICATION.CREATE, notificationData);
    return response.data;
  },

  // Update notification
  updateNotification: async (id, notificationData) => {
    const response = await apiClient.put(API_ENDPOINTS.NOTIFICATION.UPDATE(id), notificationData);
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.NOTIFICATION.DELETE(id));
    return response.data;
  },

  // Get notifications by user
  getNotificationsByUser: async (userId) => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION.BY_USER(userId));
    return response.data;
  },

  // Get notifications by user (paginated)
  getNotificationsByUserPaginated: async (userId, page = 0, size = 10) => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION.BY_USER_PAGINATED(userId), {
      params: { page, size },
    });
    return response.data;
  },

  // Get notifications by user and read status
  getNotificationsByUserAndReadStatus: async (userId, isRead) => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION.BY_USER_AND_READ_STATUS(userId, isRead));
    return response.data;
  },

  // Get notifications by type
  getNotificationsByType: async (type) => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION.BY_TYPE(type));
    return response.data;
  },

  // Get notifications by type (paginated)
  getNotificationsByTypePaginated: async (type, page = 0, size = 10) => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION.BY_TYPE_PAGINATED(type), {
      params: { page, size },
    });
    return response.data;
  },

  // Get unread notifications by user
  getUnreadNotificationsByUser: async (userId) => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION.UNREAD_BY_USER(userId));
    return response.data;
  },

  // Get unread notification count by user
  getUnreadNotificationCountByUser: async (userId) => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION.UNREAD_COUNT_BY_USER(userId));
    return response.data;
  },

  // Mark notification as read
  markNotificationAsRead: async (id) => {
    const response = await apiClient.put(API_ENDPOINTS.NOTIFICATION.MARK_READ(id));
    return response.data;
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async (userId) => {
    const response = await apiClient.put(API_ENDPOINTS.NOTIFICATION.MARK_ALL_READ(userId));
    return response.data;
  },

  // Get notifications by date range
  getNotificationsByDateRange: async (startDate, endDate) => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATION.BY_DATE_RANGE, {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

export default notificationService;

