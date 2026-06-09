/**
 * Normalize report data from backend format to frontend format
 * Backend sends reportType, frontend expects type
 */
export const normalizeReport = (report) => {
  if (!report || typeof report !== 'object') return null;
  
  try {
    return {
      ...report,
      // Normalize reportType to type for frontend compatibility
      type: report.type || report.reportType || null,
    };
  } catch (error) {
    console.error('Error normalizing report:', error, report);
    return null;
  }
};

/**
 * Normalize array of reports
 */
export const normalizeReports = (reports) => {
  if (!reports) return [];
  if (!Array.isArray(reports)) {
    console.warn('normalizeReports received non-array:', reports);
    return [];
  }
  try {
    return reports.map(normalizeReport).filter(report => report !== null);
  } catch (error) {
    console.error('Error normalizing reports array:', error, reports);
    return [];
  }
};

/**
 * Get full location path string (Province → District → Sector → Cell → Village)
 */
export const getLocationPath = (location) => {
  if (!location) return null;
  
  const path = [];
  let current = location;
  
  // Build path from current location up to root (province)
  while (current) {
    path.unshift(current.name);
    current = current.parent;
  }
  
  return path.join(' → ');
};

/**
 * Get location path as array (for detailed display)
 */
export const getLocationPathArray = (location) => {
  if (!location) return [];
  
  const path = [];
  let current = location;
  
  while (current) {
    path.unshift(current);
    current = current.parent;
  }
  
  return path;
};

