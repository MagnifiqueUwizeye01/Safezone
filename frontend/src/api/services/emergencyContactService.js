import apiClient from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';

export const emergencyContactService = {
  // Get all emergency contacts
  getAllEmergencyContacts: async () => {
    const response = await apiClient.get(API_ENDPOINTS.EMERGENCY_CONTACT.ALL);
    return response.data;
  },

  // Get emergency contact by ID
  getEmergencyContactById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.EMERGENCY_CONTACT.BY_ID(id));
    return response.data;
  },

  // Create emergency contact
  createEmergencyContact: async (contactData) => {
    const response = await apiClient.post(API_ENDPOINTS.EMERGENCY_CONTACT.CREATE, contactData);
    return response.data;
  },

  // Update emergency contact
  updateEmergencyContact: async (id, contactData) => {
    const response = await apiClient.put(API_ENDPOINTS.EMERGENCY_CONTACT.UPDATE(id), contactData);
    return response.data;
  },

  // Delete emergency contact
  deleteEmergencyContact: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.EMERGENCY_CONTACT.DELETE(id));
    return response.data;
  },

  // Get contacts by department
  getContactsByDepartment: async (department) => {
    const response = await apiClient.get(API_ENDPOINTS.EMERGENCY_CONTACT.BY_DEPARTMENT(department));
    return response.data;
  },

  // Get contacts by department (paginated)
  getContactsByDepartmentPaginated: async (department, page = 0, size = 10) => {
    const response = await apiClient.get(API_ENDPOINTS.EMERGENCY_CONTACT.BY_DEPARTMENT_PAGINATED(department), {
      params: { page, size },
    });
    return response.data;
  },

  // Get contacts by location
  getContactsByLocation: async (locationId) => {
    const response = await apiClient.get(API_ENDPOINTS.EMERGENCY_CONTACT.BY_LOCATION(locationId));
    return response.data;
  },

  // Get active emergency contacts
  getActiveContacts: async () => {
    const response = await apiClient.get(API_ENDPOINTS.EMERGENCY_CONTACT.ACTIVE);
    return response.data;
  },

  // Get active emergency contacts (paginated)
  getActiveContactsPaginated: async (page = 0, size = 10) => {
    const response = await apiClient.get(API_ENDPOINTS.EMERGENCY_CONTACT.ACTIVE_PAGINATED, {
      params: { page, size },
    });
    return response.data;
  },

  // Get contacts by location and department
  getContactsByLocationAndDepartment: async (locationId, department) => {
    const response = await apiClient.get(
      API_ENDPOINTS.EMERGENCY_CONTACT.BY_LOCATION_AND_DEPARTMENT(locationId, department)
    );
    return response.data;
  },
};

export default emergencyContactService;

