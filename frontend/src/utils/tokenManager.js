import { STORAGE_KEYS } from './constants';

export const tokenManager = {
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  setToken: (token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },

  getRefreshToken: () => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken: (refreshToken) => {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  removeTokens: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  isTokenExpired: (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= exp;
    } catch (error) {
      return true;
    }
  },
};

