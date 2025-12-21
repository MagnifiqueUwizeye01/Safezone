import apiClient from '../axiosConfig';
import { API_ENDPOINTS } from '../endpoints';

export const authService = {
  // Login - uses /user/login endpoint (backend doesn't have /auth/login)
  login: async (credentials) => {
    const response = await apiClient.post(`${API_ENDPOINTS.USER.BASE}/login`, credentials);
    return response.data;
  },

  // Register - uses /user/create endpoint
  register: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.USER.CREATE, userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken,
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    // Backend now returns { success: boolean, message: string }
    return response.data;
  },

  // Reset password (OTP-based)
  resetPassword: async (email, otp, newPassword, confirmPassword) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      email,
      otp,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (email, otp, purpose = 'VERIFICATION') => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, {
      email,
      otp,
      purpose,
    });
    return response.data;
  },

  // Two-factor authentication
  enable2FA: async (userId) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.TWO_FACTOR_AUTH + '/enable', {
      userId,
    });
    return response.data;
  },

  verify2FA: async (userId, code) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.TWO_FACTOR_AUTH + '/verify', {
      userId,
      code,
    });
    return response.data;
  },

  disable2FA: async (userId) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.TWO_FACTOR_AUTH + '/disable', {
      userId,
    });
    return response.data;
  },

  // Google authentication
  googleAuth: async (userInfo) => {
    const response = await apiClient.post(`${API_ENDPOINTS.AUTH.GOOGLE_AUTH}/callback`, userInfo);
    return response.data;
  },
};

export default authService;

