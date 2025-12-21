import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import { hasRole } from '../utils/roleChecker';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  return (
    <ProtectedRoute>
      <RoleCheck allowedRoles={allowedRoles}>
        {children}
      </RoleCheck>
    </ProtectedRoute>
  );
};

const RoleCheck = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(user, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleBasedRoute;

