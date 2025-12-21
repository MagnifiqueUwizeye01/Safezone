/**
 * Utility to clean up corrupted or oversized localStorage data
 * Call this on app initialization to prevent quota exceeded errors
 */
export const cleanupLocalStorage = () => {
  try {
    // Clear ALL potentially large data first
    const keysToCheck = ['user', 'token', 'refreshToken'];
    
    keysToCheck.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item && item.length > 500000) { // 500KB threshold
          console.warn(`Removing large item from localStorage: ${key} (${item.length} bytes)`);
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.error(`Error checking ${key}:`, error);
        // If we can't read it, try to remove it
        try {
          localStorage.removeItem(key);
        } catch (removeError) {
          console.error(`Error removing ${key}:`, removeError);
        }
      }
    });
    
    // Now clean the user object if it exists
    const userStr = localStorage.getItem('user');
    if (userStr) {
      if (userStr.length > 2000000) { // 2MB threshold
        console.warn('User data in localStorage is too large, clearing...');
        localStorage.removeItem('user');
        return;
      }
      
      try {
        const user = JSON.parse(userStr);
        // Create a clean user object with only essential data
        const cleanedUser = {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
          location: user.location ? {
            id: user.location.id,
            name: user.location.name,
            code: user.location.code,
            type: user.location.type
          } : null
          // NO PROFILE FIELD - completely removed
        };
        
        localStorage.setItem('user', JSON.stringify(cleanedUser));
        console.log('Cleaned user data in localStorage');
      } catch (parseError) {
        console.error('Error parsing user data, removing:', parseError);
        localStorage.removeItem('user');
      }
    }
  } catch (error) {
    console.error('Error cleaning localStorage:', error);
    // Last resort: clear everything
    try {
      localStorage.clear();
    } catch (clearError) {
      console.error('Error clearing localStorage:', clearError);
    }
  }
};

/**
 * Create a clean user object with only essential data
 * PROFILE DATA IS COMPLETELY REMOVED - no profile field at all
 * Handles UUID and enum normalization
 */
export const createCleanUserObject = (userData) => {
  if (!userData) {
    console.error('createCleanUserObject: userData is null or undefined');
    return null;
  }
  
  // Normalize ID (handle UUID objects/strings)
  let userId = userData.id;
  if (userId) {
    if (typeof userId === 'object' && userId !== null) {
      userId = userId.toString();
    } else {
      userId = String(userId);
    }
  }
  
  // Normalize role (handle enum objects/strings)
  let userRole = userData.role;
  if (userRole) {
    if (typeof userRole === 'object' && userRole !== null) {
      userRole = userRole.name || userRole.toString().toUpperCase();
    } else if (typeof userRole === 'string') {
      userRole = userRole.toUpperCase();
    }
  }
  
  // Validate essential fields
  if (!userId) {
    console.error('createCleanUserObject: userData missing id after normalization:', userData);
    return null;
  }
  
  if (!userRole) {
    console.error('createCleanUserObject: userData missing role after normalization:', userData);
    return null;
  }
  
  // Normalize location (handle nested objects)
  let cleanLocation = null;
  if (userData.location) {
    let locationId = userData.location.id;
    if (locationId && typeof locationId === 'object') {
      locationId = locationId.toString();
    }
    
    cleanLocation = {
      id: locationId ? String(locationId) : null,
      name: userData.location.name || null,
      code: userData.location.code || null,
      type: userData.location.type || null
    };
  }
  
  // NO PROFILE FIELD - completely removed
  return {
    id: userId,
    username: userData.username || null,
    fullName: userData.fullName || null,
    email: userData.email || null,
    phone: userData.phone || null,
    role: userRole,
    twoFactorEnabled: userData.twoFactorEnabled === true,
    location: cleanLocation
    // NO PROFILE FIELD - completely removed
  };
};

/**
 * Safely set item in localStorage with size check
 */
export const safeSetItem = (key, value) => {
  try {
    const valueStr = JSON.stringify(value);
    if (valueStr.length > 1000000) { // 1MB warning
      console.warn(`Warning: ${key} is very large (${valueStr.length} bytes)`);
    }
    localStorage.setItem(key, valueStr);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error(`localStorage quota exceeded for key: ${key}`);
      // Try to clean up and retry
      cleanupLocalStorage();
      try {
        const valueStr = JSON.stringify(value);
        localStorage.setItem(key, valueStr);
        return true;
      } catch (retryError) {
        console.error('Failed to set item after cleanup:', retryError);
        return false;
      }
    }
    throw error;
  }
};

