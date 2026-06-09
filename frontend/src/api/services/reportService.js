import apiClient from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';

export const reportService = {
  // Get all reports
  getAllReports: async () => {
    const response = await apiClient.get(API_ENDPOINTS.REPORT.ALL);
    return response.data;
  },

  // Get report by ID
  getReportById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.REPORT.BY_ID(id));
    return response.data;
  },

  // Create report
  createReport: async (reportData) => {
    const response = await apiClient.post(API_ENDPOINTS.REPORT.CREATE, reportData);
    return response.data;
  },

  // Update report
  updateReport: async (id, reportData) => {
    const response = await apiClient.put(API_ENDPOINTS.REPORT.UPDATE(id), reportData);
    return response.data;
  },

  // Delete report
  deleteReport: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.REPORT.DELETE(id));
    return response.data;
  },

  // Get reports by status
  getReportsByStatus: async (status, sortBy = 'title', direction = 'ASC') => {
    const response = await apiClient.get(API_ENDPOINTS.REPORT.BY_STATUS(status), {
      params: { sortBy, direction },
    });
    return response.data;
  },

  // Get reports by status (paginated)
  getReportsByStatusPaginated: async (status, page = 0, size = 10, sortBy = 'title', direction = 'ASC') => {
    const response = await apiClient.get(API_ENDPOINTS.REPORT.BY_STATUS_PAGINATED(status), {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  },
};

export default reportService;

