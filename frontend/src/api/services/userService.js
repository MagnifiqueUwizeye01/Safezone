import apiClient from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';

export const userService = {
  // Get all users
  getAllUsers: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USER.ALL);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.USER.BY_ID(id));
    return response.data;
  },

  // Create user (only for CITIZEN role - public registration)
  createUser: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.USER.CREATE, userData);
    return response.data;
  },

  // Create POLICE user (admin-only, requires badge number and police station)
  createPoliceUser: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.USER.CREATE_POLICE, userData);
    return response.data;
  },

  // Create ADMIN user (admin-only)
  createAdminUser: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.USER.CREATE_ADMIN, userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE(id), userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.USER.DELETE(id));
    return response.data;
  },

  // Get users by role
  getUsersByRole: async (role, sortBy = 'username', direction = 'ASC') => {
    const response = await apiClient.get(API_ENDPOINTS.USER.BY_ROLE(role), {
      params: { sortBy, direction },
    });
    return response.data;
  },

  // Get users by role (paginated)
  getUsersByRolePaginated: async (role, page = 0, size = 10, sortBy = 'username', direction = 'ASC') => {
    const response = await apiClient.get(API_ENDPOINTS.USER.BY_ROLE_PAGINATED(role), {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  },

  // Get users by province code
  getUsersByProvinceCode: async (code) => {
    const response = await apiClient.get(API_ENDPOINTS.USER.BY_PROVINCE_CODE(code));
    return response.data;
  },

  // Get users by province name
  getUsersByProvinceName: async (name) => {
    const response = await apiClient.get(API_ENDPOINTS.USER.BY_PROVINCE_NAME(name));
    return response.data;
  },

  // Get users by location ID
  getUsersByLocationId: async (locationId) => {
    const response = await apiClient.get(API_ENDPOINTS.USER.BY_LOCATION(locationId));
    return response.data;
  },

  // Get users by location ID (paginated)
  getUsersByLocationIdPaginated: async (locationId, page = 0, size = 10, sortBy = 'username', direction = 'ASC') => {
    const response = await apiClient.get(API_ENDPOINTS.USER.BY_LOCATION_PAGINATED(locationId), {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  },

  // Get province by user ID
  getProvinceByUserId: async (userId) => {
    const response = await apiClient.get(API_ENDPOINTS.USER.PROVINCE_BY_USER(userId));
    return response.data;
  },
};

export default userService;

