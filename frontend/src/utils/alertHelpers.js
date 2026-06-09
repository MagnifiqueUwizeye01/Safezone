/**
 * Normalize alert data from backend format to frontend format
 * Backend sends alertType, frontend expects type
 */
export const normalizeAlert = (alert) => {
  if (!alert || typeof alert !== 'object') return null;
  
  try {
    return {
      ...alert,
      // Normalize alertType to type for frontend compatibility
      type: alert.type || alert.alertType || null,
      // Normalize message to description for form compatibility
      description: alert.description || alert.message || '',
    };
  } catch (error) {
    console.error('Error normalizing alert:', error, alert);
    return null;
  }
};

/**
 * Normalize array of alerts
 */
export const normalizeAlerts = (alerts) => {
  if (!alerts) return [];
  if (!Array.isArray(alerts)) {
    console.warn('normalizeAlerts received non-array:', alerts);
    return [];
  }
  try {
    return alerts.map(normalizeAlert).filter(alert => alert !== null);
  } catch (error) {
    console.error('Error normalizing alerts array:', error, alerts);
    return [];
  }
};

