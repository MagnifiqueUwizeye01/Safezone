import apiClient from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';

export const profileService = {
  // Get all user profiles
  getAllUserProfiles: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USER_PROFILE.ALL);
    return response.data;
  },

  // Get user profile by ID
  getUserProfileById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.USER_PROFILE.BY_ID(id));
    return response.data;
  },

  // Get user profile by user ID
  getUserProfileByUserId: async (userId) => {
    const response = await apiClient.get(API_ENDPOINTS.USER_PROFILE.BY_USER(userId));
    return response.data;
  },

  // Create user profile
  createUserProfile: async (profileData) => {
    const response = await apiClient.post(API_ENDPOINTS.USER_PROFILE.CREATE, profileData);
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (id, profileData) => {
    const response = await apiClient.put(API_ENDPOINTS.USER_PROFILE.UPDATE(id), profileData);
    return response.data;
  },

  // Delete user profile
  deleteUserProfile: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.USER_PROFILE.DELETE(id));
    return response.data;
  },
};

export default profileService;

