import { USER_ROLES } from './constants';

export const isAdmin = (user) => {
  return user?.role === USER_ROLES.ADMIN;
};

export const isPolice = (user) => {
  return user?.role === USER_ROLES.POLICE;
};

export const isCitizen = (user) => {
  return user?.role === USER_ROLES.CITIZEN;
};

export const hasRole = (user, roles) => {
  if (!user || !user.role) return false;
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  return user.role === roles;
};

export const canAccess = (user, requiredRole) => {
  if (!user) return false;
  
  const roleHierarchy = {
    [USER_ROLES.ADMIN]: [USER_ROLES.ADMIN, USER_ROLES.POLICE, USER_ROLES.CITIZEN],
    [USER_ROLES.POLICE]: [USER_ROLES.POLICE, USER_ROLES.CITIZEN],
    [USER_ROLES.CITIZEN]: [USER_ROLES.CITIZEN],
  };

  const userRoles = roleHierarchy[user.role] || [];
  return userRoles.includes(requiredRole);
};

