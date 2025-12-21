import { formatDate, formatDateTime } from './helpers';

export const formatUserRole = (role) => {
  if (!role) return '';
  return role.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

export const formatLocationType = (type) => {
  if (!type) return '';
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

export const formatReportStatus = (status) => {
  if (!status) return '';
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

export const formatReportType = (type) => {
  if (!type) return '';
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

export const formatAlertType = (type) => {
  if (!type) return '';
  return type.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Format: (250) 788-123-456
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('250')) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 9)}-${cleaned.substring(9)}`;
  }
  return phone;
};

export { formatDate, formatDateTime };

