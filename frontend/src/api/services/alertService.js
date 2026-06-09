import apiClient from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';

export const alertService = {
  // Get all alerts
  getAllAlerts: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ALERT.ALL);
    return response.data;
  },

  // Get alert by ID
  getAlertById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.ALERT.BY_ID(id));
    return response.data;
  },

  // Create alert
  createAlert: async (alertData) => {
    const response = await apiClient.post(API_ENDPOINTS.ALERT.CREATE, alertData);
    return response.data;
  },

  // Update alert
  updateAlert: async (id, alertData) => {
    const response = await apiClient.put(API_ENDPOINTS.ALERT.UPDATE(id), alertData);
    return response.data;
  },

  // Delete alert
  deleteAlert: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.ALERT.DELETE(id));
    return response.data;
  },

  // Get alerts by type (paginated)
  getAlertsByTypePaginated: async (type, page = 0, size = 10) => {
    const response = await apiClient.get(API_ENDPOINTS.ALERT.BY_TYPE_PAGINATED(type), {
      params: { page, size },
    });
    return response.data;
  },
};

export default alertService;

