// User Roles
export const USER_ROLES = {
  CITIZEN: 'CITIZEN',
  POLICE: 'POLICE',
  ADMIN: 'ADMIN',
};

// Location Types
export const LOCATION_TYPES = {
  PROVINCE: 'PROVINCE',
  DISTRICT: 'DISTRICT',
  SECTOR: 'SECTOR',
  CELL: 'CELL',
  VILLAGE: 'VILLAGE',
};

// Report Status
export const REPORT_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CANCELLED: 'CANCELLED',
};

// Report Types
export const REPORT_TYPES = {
  THEFT: 'THEFT',
  VIOLENCE: 'VIOLENCE',
  HARASSMENT: 'HARASSMENT',
  VANDALISM: 'VANDALISM',
  LOST_ITEM: 'LOST_ITEM',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  EMERGENCY: 'EMERGENCY',
  OTHER: 'OTHER',
};

// Alert Types
export const ALERT_TYPES = {
  WARNING: 'WARNING',
  EMERGENCY: 'EMERGENCY',
  INFO: 'INFO',
  SAFETY_ALERT: 'SAFETY_ALERT',
  COMMUNITY_UPDATE: 'COMMUNITY_UPDATE',
};

// Emergency Contact Departments
export const EMERGENCY_DEPARTMENTS = {
  POLICE: 'POLICE',
  FIRE: 'FIRE',
  MEDICAL: 'MEDICAL',
  AMBULANCE: 'AMBULANCE',
  OTHER: 'OTHER',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  REPORT: 'REPORT',
  ALERT: 'ALERT',
  SYSTEM: 'SYSTEM',
  OTHER: 'OTHER',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
};

// API Timeout
export const API_TIMEOUT = 30000;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss",
};

