import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Home, FileText, AlertCircle, Bell, MapPin, Phone } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  const getMenuItems = () => {
    if (!user) return [];

    const role = user.role?.toLowerCase();

    const allItems = {
      admin: [
        { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
        { path: '/admin/users', label: 'User Management', icon: FileText },
        { path: '/admin/locations', label: 'Location Management', icon: MapPin },
        { path: '/admin/reports', label: 'Report Management', icon: FileText },
        { path: '/admin/alerts', label: 'Alert Management', icon: AlertCircle },
        { path: '/admin/emergency', label: 'Emergency Contacts', icon: Phone },
        { path: '/admin/analytics', label: 'Analytics', icon: FileText },
        { path: '/admin/notifications', label: 'Notifications', icon: Bell },
        { path: '/admin/settings', label: 'System Settings', icon: FileText },
        { path: '/admin/profile', label: 'Profile', icon: FileText },
      ],
      police: [
        { path: '/police/dashboard', label: 'Dashboard', icon: Home },
        { path: '/police/reports', label: 'All Reports', icon: FileText },
        { path: '/police/alerts', label: 'Manage Alerts', icon: AlertCircle },
        { path: '/police/create-alert', label: 'Create Alert', icon: AlertCircle },
        { path: '/police/analytics', label: 'Incident Analytics', icon: FileText },
        { path: '/police/emergency', label: 'Emergency Contacts', icon: Phone },
        { path: '/police/notifications', label: 'Notifications', icon: Bell },
        { path: '/police/profile', label: 'Profile', icon: FileText },
      ],
      citizen: [
        { path: '/citizen/dashboard', label: 'Dashboard', icon: Home },
        { path: '/citizen/reports', label: 'My Reports', icon: FileText },
        { path: '/citizen/create-report', label: 'Report Incident', icon: AlertCircle },
        { path: '/citizen/alerts', label: 'Safety Alerts', icon: Bell },
        { path: '/citizen/notifications', label: 'Notifications', icon: Bell },
        { path: '/citizen/profile', label: 'My Profile', icon: MapPin },
        { path: '/citizen/emergency', label: 'Emergency Contacts', icon: Phone },
      ],
    };

    return allItems[role] || [];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          w-64
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">SZ</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">SafeZone</h2>
              <p className="text-xs text-gray-500">Community Safety</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-200
                      ${active 
                        ? 'bg-emerald-50 text-emerald-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                    onClick={onClose}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-emerald-700' : 'text-gray-600'}`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Help Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-emerald-900 mb-1">Need Help?</h3>
            <p className="text-xs text-emerald-800 mb-3">Contact support for assistance</p>
            <Link
              to="/contact"
              className="block w-full text-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium"
              onClick={onClose}
            >
              Get Support
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
