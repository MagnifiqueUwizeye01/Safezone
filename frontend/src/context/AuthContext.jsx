import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/services/authService';
import { tokenManager } from '../utils/tokenManager';
import { STORAGE_KEYS } from '../utils/constants';
import { cleanupLocalStorage, createCleanUserObject } from '../utils/storageCleanup';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Clean up corrupted or oversized localStorage data first
    cleanupLocalStorage();
    
    // Check if user is already logged in
    try {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const token = tokenManager.getToken();

      if (storedUser && token) {
        try {
          // Check if stored data is too large (corrupted or contains large base64 images)
          if (storedUser.length > 2000000) { // 2MB threshold
            console.warn('Stored user data is too large (' + storedUser.length + ' bytes), clearing corrupted data...');
            localStorage.removeItem(STORAGE_KEYS.USER);
            tokenManager.removeTokens();
            setLoading(false);
            return;
          }
          
          // Check if token is expired (only if it's a valid JWT)
          let isExpired = false;
          
          // Check if token is a JWT (has dots) or a temp token
          if (token.includes('.') && token.split('.').length === 3) {
            // It's a JWT, check expiration
            try {
              isExpired = tokenManager.isTokenExpired(token);
            } catch (tokenError) {
              // If token parsing fails, consider it expired
              console.warn('Token validation error:', tokenError);
              isExpired = true;
            }
          } else {
            // It's a temp token (like "temp-token-{userId}"), treat as valid
            // In production, you'd want to validate these differently
            isExpired = false;
          }

          if (!isExpired) {
            const parsedUser = JSON.parse(storedUser);
            // Validate user object has required fields
            if (!parsedUser || !parsedUser.id || !parsedUser.role) {
              console.warn('Invalid user data in localStorage, clearing...');
              tokenManager.removeTokens();
              localStorage.removeItem(STORAGE_KEYS.USER);
              setLoading(false);
              return;
            }
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // Token expired, clear storage
            tokenManager.removeTokens();
            localStorage.removeItem(STORAGE_KEYS.USER);
          }
        } catch (parseError) {
          console.error('Error parsing stored user:', parseError);
          // Clear corrupted data
          tokenManager.removeTokens();
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      }
    } catch (error) {
      console.error('Error in AuthContext useEffect:', error);
      // Clear potentially corrupted data
      try {
        tokenManager.removeTokens();
        localStorage.removeItem(STORAGE_KEYS.USER);
      } catch (clearError) {
        console.error('Error clearing storage:', clearError);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      console.log('AuthContext: Attempting login with:', { email: credentials.email });
      
      // CLEAR localStorage FIRST to free up space before storing new data
      try {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        console.log('Cleared localStorage before login');
      } catch (clearError) {
        console.warn('Error clearing localStorage before login:', clearError);
      }
      
      const response = await authService.login(credentials);
      console.log('AuthContext: Login response received:', response);
      console.log('AuthContext: Response type:', typeof response);
      console.log('AuthContext: Is array:', Array.isArray(response));
      if (response) {
        console.log('AuthContext: Response keys:', Object.keys(response));
        console.log('AuthContext: Has user property:', 'user' in response);
        console.log('AuthContext: Has id property:', 'id' in response);
      }

      // Handle error responses (string error messages)
      if (typeof response === 'string') {
        console.error('AuthContext: Backend returned error string:', response);
        throw new Error(response);
      }

      // Extract response data - Backend returns { user: User, token: string, requires2FA: boolean, success: boolean, message: string }
      let token, refreshToken, requires2FA;
      let rawUserData = null;
      
      // Check if response has user property (normal case - LoginResponse)
      if (response && typeof response === 'object' && response.user) {
        console.log('AuthContext: Found user in response.user');
        rawUserData = response.user;
        token = response.token;
        requires2FA = response.requires2FA === true;
        refreshToken = response.refreshToken;
      } 
      // Check if response itself is a user object (fallback)
      else if (response && typeof response === 'object' && response.id && !response.user) {
        console.log('AuthContext: Response is user object directly');
        rawUserData = response;
        token = response.token || `temp-${response.id}`;
        requires2FA = false;
      } 
      // Check if response has data property (nested response)
      else if (response && typeof response === 'object' && response.data) {
        if (response.data.user) {
          console.log('AuthContext: Found user in response.data.user');
          rawUserData = response.data.user;
          token = response.data.token;
          requires2FA = response.data.requires2FA === true;
          refreshToken = response.data.refreshToken;
        } else if (response.data.id) {
          console.log('AuthContext: response.data is user object');
          rawUserData = response.data;
          token = response.data.token || `temp-${response.data.id}`;
          requires2FA = false;
        }
      }
      
      // If we still don't have user data, throw error with details
      if (!rawUserData) {
        console.error('AuthContext: Could not extract user data from response');
        console.error('AuthContext: Full response:', JSON.stringify(response, null, 2));
        throw new Error('Invalid response format from server. Expected user data but received: ' + (typeof response === 'string' ? response : JSON.stringify(response).substring(0, 200)));
      }

      // Validate we have user data
      if (!rawUserData) {
        throw new Error('No user data received from server');
      }

      // Extract ONLY essential fields - ignore profile completely
      let userId = rawUserData.id;
      if (userId && typeof userId === 'object') {
        userId = userId.toString();
      } else if (userId) {
        userId = String(userId);
      }

      let userRole = rawUserData.role;
      if (userRole && typeof userRole === 'object') {
        userRole = userRole.name || userRole.toString().toUpperCase();
      } else if (userRole && typeof userRole === 'string') {
        userRole = userRole.toUpperCase();
      }

      // Validate essential fields
      if (!userId) {
        console.error('AuthContext: User ID missing:', rawUserData);
        throw new Error('User account data is incomplete. Please contact support.');
      }
      
      if (!userRole) {
        console.error('AuthContext: User role missing:', rawUserData);
        throw new Error('User account is missing role information. Please contact support.');
      }

      // Validate role
      const validRoles = ['CITIZEN', 'POLICE', 'ADMIN'];
      if (!validRoles.includes(userRole)) {
        console.error('AuthContext: Invalid role:', userRole);
        throw new Error(`Invalid user role: ${userRole}. Please contact support.`);
      }

      // Create minimal user object - NO PROFILE DATA AT ALL
      const minimalUser = {
        id: userId,
        username: rawUserData.username || null,
        fullName: rawUserData.fullName || null,
        email: rawUserData.email || null,
        phone: rawUserData.phone || null,
        role: userRole,
        twoFactorEnabled: rawUserData.twoFactorEnabled === true,
        location: rawUserData.location ? {
          id: rawUserData.location.id ? String(rawUserData.location.id) : null,
          name: rawUserData.location.name || null,
          code: rawUserData.location.code || null,
          type: rawUserData.location.type || null
        } : null
        // NO PROFILE FIELD - completely removed
      };

      // Store minimal user data
      try {
        const userString = JSON.stringify(minimalUser);
        console.log('AuthContext: Storing minimal user data:', { id: minimalUser.id, role: minimalUser.role, size: userString.length });
        localStorage.setItem(STORAGE_KEYS.USER, userString);
        
        // Set user in state with minimal data (no profile)
        setUser(minimalUser);
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          console.error('AuthContext: localStorage quota exceeded');
          // Last resort: store only absolute essentials
          const essentialUser = {
            id: userId,
            email: rawUserData.email || null,
            role: userRole
          };
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(essentialUser));
          setUser(essentialUser);
        } else {
          throw error;
        }
      }

      // Keep reference to full user data for components (but don't store profile in state either)
      const userData = {
        ...minimalUser,
        createdAt: rawUserData.createdAt || null
        // Still no profile
      };

      // If 2FA is required, don't set authenticated yet - wait for 2FA verification
      if (requires2FA) {
        if (token) {
          tokenManager.setToken(token); // Store temp token
        }
        return { 
          success: true, 
          requires2FA: true,
          user: userData,
          message: response.message || '2FA code has been sent to your email'
        };
      }

      // Normal login (no 2FA)
      if (token) {
        tokenManager.setToken(token);
      }
      if (refreshToken) {
        tokenManager.setRefreshToken(refreshToken);
      }
      if (userData) {
        // Validate that user has required fields
        if (!userData.id || !userData.role) {
          console.error('User data missing required fields:', { id: userData.id, role: userData.role });
          throw new Error('Invalid user data: missing id or role');
        }
        
        setIsAuthenticated(true);
        return { 
          success: true, 
          requires2FA: false,
          user: userData // Return user data so Login component can access it
        };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      console.error('AuthContext: Error type:', typeof error);
      console.error('AuthContext: Error message:', error.message);
      console.error('AuthContext: Error response:', error.response);
      console.error('AuthContext: Error response data:', error.response?.data);
      console.error('AuthContext: Error response status:', error.response?.status);
      
      let errorMessage = 'Login failed';
      
      // Handle HTTP errors
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 500) {
          errorMessage = 'Server error. Please check backend logs and ensure the server is running correctly.';
          console.error('AuthContext: Backend returned 500 error. This indicates a server-side problem.');
        } else if (status === 404) {
          errorMessage = 'Login endpoint not found. Please check backend configuration.';
        } else if (status === 401) {
          errorMessage = typeof data === 'string' ? data : (data?.message || 'Invalid email or password');
        } else if (data) {
          errorMessage = typeof data === 'string' ? data : (data?.message || `Server error (${status})`);
        }
      } 
      // Handle network errors
      else if (error.message) {
        if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot connect to server. Please ensure the backend is running.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      tokenManager.removeTokens();
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  const updateUser = (userData) => {
    // Use deep clean function to remove ALL large data before storing
    const userToStore = createCleanUserObject(userData);
    
    try {
      const userString = JSON.stringify(userToStore);
      // Check size (localStorage limit is ~5-10MB)
      if (userString.length > 1000000) { // 1MB warning
        console.warn('User data is very large:', userString.length, 'bytes');
      }
      localStorage.setItem(STORAGE_KEYS.USER, userString);
      setUser(userData); // Keep full data in state, but not in localStorage
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded. Storing minimal user data only.');
        // Store minimal user data only
        const minimalUser = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: userData.role
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(minimalUser));
        setUser(userData);
      } else {
        console.error('Error updating user:', error);
        throw error;
      }
    }
  };

  const completeLogin = (userData, token) => {
    console.log('Completing login with:', { userData, token });
    
    // Set token first
    if (token) {
      tokenManager.setToken(token);
      console.log('Token set:', token);
    }
    
    // Set user data - NO PROFILE DATA
    if (userData) {
      const userToStore = {
        id: userData.id ? String(userData.id) : null,
        username: userData.username || null,
        fullName: userData.fullName || null,
        email: userData.email || null,
        phone: userData.phone || null,
        role: userData.role ? (typeof userData.role === 'string' ? userData.role.toUpperCase() : String(userData.role).toUpperCase()) : null,
        twoFactorEnabled: userData.twoFactorEnabled === true,
        location: userData.location ? {
          id: userData.location.id ? String(userData.location.id) : null,
          name: userData.location.name || null,
          code: userData.location.code || null,
          type: userData.location.type || null
        } : null
        // NO PROFILE FIELD - completely removed
      };
      
      try {
        const userString = JSON.stringify(userToStore);
        console.log('CompleteLogin: User data size:', userString.length, 'bytes');
        localStorage.setItem(STORAGE_KEYS.USER, userString);
        setUser(userToStore); // Store cleaned data
        console.log('CompleteLogin: User set');
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          console.error('CompleteLogin: localStorage quota exceeded. Storing minimal user data only.');
          const minimalUser = {
            id: userData.id ? String(userData.id) : null,
            email: userData.email || null,
            role: userData.role ? (typeof userData.role === 'string' ? userData.role.toUpperCase() : String(userData.role).toUpperCase()) : null
          };
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(minimalUser));
          setUser(minimalUser);
        } else {
          throw error;
        }
      }
    }
    
    // Set authenticated state - this is critical!
    setIsAuthenticated(true);
    console.log('Authentication state set to true');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    completeLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

