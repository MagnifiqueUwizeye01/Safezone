import apiClient from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';

export const locationService = {
  // Get all locations
  getAllLocations: async () => {
    const response = await apiClient.get(API_ENDPOINTS.LOCATION.ALL);
    return response.data;
  },

  // Get location by ID
  getLocationById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.LOCATION.BY_ID(id));
    return response.data;
  },

  // Get location by code
  getLocationByCode: async (code) => {
    const response = await apiClient.get(API_ENDPOINTS.LOCATION.BY_CODE(code));
    return response.data;
  },

  // Get all provinces
  getAllProvinces: async () => {
    const response = await apiClient.get(API_ENDPOINTS.LOCATION.PROVINCES);
    return response.data;
  },

  // Get children by parent code
  getChildrenByParentCode: async (parentCode) => {
    const response = await apiClient.get(API_ENDPOINTS.LOCATION.CHILDREN_BY_PARENT(parentCode));
    return response.data;
  },

  // Create parent location (Province)
  createParentLocation: async (locationData) => {
    const response = await apiClient.post(API_ENDPOINTS.LOCATION.CREATE_PARENT, locationData);
    return response.data;
  },

  // Create child location (District/Sector/Cell/Village)
  createChildLocation: async (parentCode, locationData) => {
    const response = await apiClient.post(
      API_ENDPOINTS.LOCATION.CREATE_CHILD,
      locationData,
      { params: { parentCode } }
    );
    return response.data;
  },

  // Update location
  updateLocation: async (id, locationData) => {
    const response = await apiClient.put(API_ENDPOINTS.LOCATION.UPDATE(id), locationData);
    return response.data;
  },

  // Delete location
  deleteLocation: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.LOCATION.DELETE(id));
    return response.data;
  },
};

export default locationService;

