import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return null; // Or a loading spinner
  }

  // SECURITY: Always allow access to login and register pages, even if authenticated
  // Users should be able to switch accounts or explicitly log in
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  if (isAuthPage) {
    // Always show login/register pages - don't auto-redirect
    // Users can explicitly log in even if they have a session
    return children;
  }

  // For other public pages, if authenticated, redirect to appropriate dashboard
  if (isAuthenticated) {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        // No user data, show public page
        return children;
      }
      
      const user = JSON.parse(userStr);
      if (!user || !user.id || !user.role) {
        // Corrupted or invalid data - clear it and show public page
        console.warn('Invalid user data in PublicRoute, clearing...');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return children;
      }
      
      const role = user.role.toLowerCase();
      return <Navigate to={`/${role}/dashboard`} replace />;
    } catch (error) {
      // Corrupted data - clear it and show public page
      console.error('Error parsing user data in PublicRoute:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return children;
    }
  }

  return children;
};

export default PublicRoute;

