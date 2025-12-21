const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Authentication (to be implemented in backend)
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
    TWO_FACTOR_AUTH: `${API_BASE_URL}/auth/2fa`,
    GOOGLE_AUTH: `${API_BASE_URL}/auth/google`
  },

  // User endpoints
  USER: {
    BASE: `${API_BASE_URL}/user`,
    CREATE: `${API_BASE_URL}/user/create`, // Only for CITIZEN
    CREATE_POLICE: `${API_BASE_URL}/user/admin/create-police`, // Admin-only: Create POLICE user
    CREATE_ADMIN: `${API_BASE_URL}/user/admin/create-admin`, // Admin-only: Create ADMIN user
    ALL: `${API_BASE_URL}/user/all`,
    BY_ID: (id) => `${API_BASE_URL}/user/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/user/${id}`,
    DELETE: (id) => `${API_BASE_URL}/user/${id}`,
    BY_ROLE: (role) => `${API_BASE_URL}/user/role/${role}`,
    BY_ROLE_PAGINATED: (role) => `${API_BASE_URL}/user/role/${role}/paginated`,
    BY_PROVINCE_CODE: (code) => `${API_BASE_URL}/user/province/code/${code}`,
    BY_PROVINCE_NAME: (name) => `${API_BASE_URL}/user/province/name/${name}`,
    BY_LOCATION: (locationId) => `${API_BASE_URL}/user/location/${locationId}`,
    BY_LOCATION_PAGINATED: (locationId) => `${API_BASE_URL}/user/location/${locationId}/paginated`,
    PROVINCE_BY_USER: (userId) => `${API_BASE_URL}/user/${userId}/province`
  },

  // Location endpoints
  LOCATION: {
    BASE: `${API_BASE_URL}/location`,
    CREATE_PARENT: `${API_BASE_URL}/location/parent`,
    CREATE_CHILD: `${API_BASE_URL}/location/child`,
    ALL: `${API_BASE_URL}/location/all`,
    PROVINCES: `${API_BASE_URL}/location/provinces`,
    BY_ID: (id) => `${API_BASE_URL}/location/${id}`,
    BY_CODE: (code) => `${API_BASE_URL}/location/code/${code}`,
    CHILDREN_BY_PARENT: (parentCode) => `${API_BASE_URL}/location/parent/${parentCode}`,
    UPDATE: (id) => `${API_BASE_URL}/location/${id}`,
    DELETE: (id) => `${API_BASE_URL}/location/${id}`
  },

  // Report endpoints
  REPORT: {
    BASE: `${API_BASE_URL}/report`,
    CREATE: `${API_BASE_URL}/report`,
    ALL: `${API_BASE_URL}/report/all`,
    BY_ID: (id) => `${API_BASE_URL}/report/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/report/${id}`,
    DELETE: (id) => `${API_BASE_URL}/report/${id}`,
    BY_STATUS: (status) => `${API_BASE_URL}/report/status/${status}`,
    BY_STATUS_PAGINATED: (status) => `${API_BASE_URL}/report/status/${status}/paginated`
  },

  // Alert endpoints
  ALERT: {
    BASE: `${API_BASE_URL}/alert`,
    CREATE: `${API_BASE_URL}/alert`,
    ALL: `${API_BASE_URL}/alert/all`,
    BY_ID: (id) => `${API_BASE_URL}/alert/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/alert/${id}`,
    DELETE: (id) => `${API_BASE_URL}/alert/${id}`,
    BY_TYPE_PAGINATED: (type) => `${API_BASE_URL}/alert/type/${type}/paginated`
  },

  // Emergency Contact endpoints
  EMERGENCY_CONTACT: {
    BASE: `${API_BASE_URL}/emergency-contact`,
    CREATE: `${API_BASE_URL}/emergency-contact/create`,
    ALL: `${API_BASE_URL}/emergency-contact/all`,
    BY_ID: (id) => `${API_BASE_URL}/emergency-contact/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/emergency-contact/${id}`,
    DELETE: (id) => `${API_BASE_URL}/emergency-contact/${id}`,
    BY_DEPARTMENT: (department) => `${API_BASE_URL}/emergency-contact/department/${department}`,
    BY_DEPARTMENT_PAGINATED: (department) => `${API_BASE_URL}/emergency-contact/department/${department}/paginated`,
    BY_LOCATION: (locationId) => `${API_BASE_URL}/emergency-contact/location/${locationId}`,
    ACTIVE: `${API_BASE_URL}/emergency-contact/active`,
    ACTIVE_PAGINATED: `${API_BASE_URL}/emergency-contact/active/paginated`,
    BY_LOCATION_AND_DEPARTMENT: (locationId, department) => 
      `${API_BASE_URL}/emergency-contact/location/${locationId}/department/${department}`
  },

  // Notification endpoints
  NOTIFICATION: {
    BASE: `${API_BASE_URL}/notification`,
    CREATE: `${API_BASE_URL}/notification/create`,
    ALL: `${API_BASE_URL}/notification/all`,
    BY_ID: (id) => `${API_BASE_URL}/notification/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/notification/${id}`,
    DELETE: (id) => `${API_BASE_URL}/notification/${id}`,
    BY_USER: (userId) => `${API_BASE_URL}/notification/user/${userId}`,
    BY_USER_PAGINATED: (userId) => `${API_BASE_URL}/notification/user/${userId}/paginated`,
    BY_USER_AND_READ_STATUS: (userId, isRead) => 
      `${API_BASE_URL}/notification/user/${userId}/read/${isRead}`,
    BY_TYPE: (type) => `${API_BASE_URL}/notification/type/${type}`,
    BY_TYPE_PAGINATED: (type) => `${API_BASE_URL}/notification/type/${type}/paginated`,
    UNREAD_BY_USER: (userId) => `${API_BASE_URL}/notification/user/${userId}/unread`,
    UNREAD_COUNT_BY_USER: (userId) => `${API_BASE_URL}/notification/user/${userId}/unread/count`,
    MARK_READ: (id) => `${API_BASE_URL}/notification/${id}/mark-read`,
    MARK_ALL_READ: (userId) => `${API_BASE_URL}/notification/user/${userId}/mark-all-read`,
    BY_DATE_RANGE: `${API_BASE_URL}/notification/date-range`
  },

  // User Profile endpoints
  USER_PROFILE: {
    BASE: `${API_BASE_URL}/user-profile`,
    CREATE: `${API_BASE_URL}/user-profile/create`,
    ALL: `${API_BASE_URL}/user-profile/all`,
    BY_ID: (id) => `${API_BASE_URL}/user-profile/${id}`,
    BY_USER: (userId) => `${API_BASE_URL}/user-profile/user/${userId}`,
    UPDATE: (id) => `${API_BASE_URL}/user-profile/${id}`,
    DELETE: (id) => `${API_BASE_URL}/user-profile/${id}`
  }
};

export default API_ENDPOINTS;

