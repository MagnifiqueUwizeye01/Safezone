import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { USER_ROLES } from '../utils/constants';

// Public Routes
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Features from '../pages/public/Features';
import HowItWorks from '../pages/public/HowItWorks';
import PublicReports from '../pages/public/PublicReports';

// Auth Routes
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import TwoFactorAuth from '../pages/auth/TwoFactorAuth';
import VerifyOTP from '../pages/auth/VerifyOTP';

// Admin Routes
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import LocationManagement from '../pages/admin/LocationManagement';
import ReportManagement from '../pages/admin/ReportManagement';
import AlertManagement from '../pages/admin/AlertManagement';
import EmergencyManagement from '../pages/admin/EmergencyManagement';
import Analytics from '../pages/admin/Analytics';
import SystemSettings from '../pages/admin/SystemSettings';
import AdminProfile from '../pages/admin/AdminProfile';

// Police Routes
import PoliceDashboard from '../pages/police/PoliceDashboard';
import AllReports from '../pages/police/AllReports';
import ReportDetails from '../pages/police/ReportDetails';
import CreateAlert from '../pages/police/CreateAlert';
import ManageAlerts from '../pages/police/ManageAlerts';
import IncidentAnalytics from '../pages/police/IncidentAnalytics';
import EmergencyContacts from '../pages/police/EmergencyContacts';
import PoliceProfile from '../pages/police/PoliceProfile';

// Citizen Routes
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import MyReports from '../pages/citizen/MyReports';
import CreateReport from '../pages/citizen/CreateReport';
import ViewAlerts from '../pages/citizen/ViewAlerts';
import CitizenEmergencyContacts from '../pages/citizen/EmergencyContacts';
import MyNotifications from '../pages/citizen/MyNotifications';
import MyProfile from '../pages/citizen/MyProfile';

// Shared Routes
import NotFound from '../pages/shared/NotFound';
import Unauthorized from '../pages/shared/Unauthorized';
import Settings from '../pages/shared/Settings';
import Privacy from '../pages/shared/Privacy';
import Terms from '../pages/shared/Terms';
import SearchResults from '../pages/shared/SearchResults';

// Route Protection
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import PublicRoute from './PublicRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/features" element={<Features />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/public-reports" element={<PublicReports />} />

      {/* Auth Routes - Public only */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/2fa" element={<TwoFactorAuth />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AdminDashboard />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <UserManagement />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/locations"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <LocationManagement />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <ReportManagement />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/alerts"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AlertManagement />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/emergency"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <EmergencyManagement />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <Analytics />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <SystemSettings />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AdminProfile />
          </RoleBasedRoute>
        }
      />

      {/* Police Routes */}
      <Route
        path="/police/dashboard"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.POLICE]}>
            <PoliceDashboard />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/police/reports"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.POLICE]}>
            <AllReports />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/police/reports/:id"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.POLICE]}>
            <ReportDetails />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/police/create-alert"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.POLICE]}>
            <CreateAlert />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/police/alerts"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.POLICE]}>
            <ManageAlerts />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/police/analytics"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.POLICE]}>
            <IncidentAnalytics />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/police/emergency"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.POLICE]}>
            <EmergencyContacts />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/police/profile"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.POLICE]}>
            <PoliceProfile />
          </RoleBasedRoute>
        }
      />

      {/* Citizen Routes */}
      <Route
        path="/citizen/dashboard"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.CITIZEN]}>
            <CitizenDashboard />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/citizen/reports"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.CITIZEN]}>
            <MyReports />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/citizen/create-report"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.CITIZEN]}>
            <CreateReport />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/citizen/alerts"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.CITIZEN]}>
            <ViewAlerts />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/citizen/emergency"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.CITIZEN]}>
            <CitizenEmergencyContacts />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/citizen/notifications"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.CITIZEN]}>
            <MyNotifications />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/citizen/profile"
        element={
          <RoleBasedRoute allowedRoles={[USER_ROLES.CITIZEN]}>
            <MyProfile />
          </RoleBasedRoute>
        }
      />

      {/* Shared Protected Routes */}
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Public Pages - Accessible to all */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />

      {/* Error Routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

