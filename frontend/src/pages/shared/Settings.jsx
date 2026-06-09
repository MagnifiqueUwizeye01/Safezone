import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatUserRole } from '../../utils/formatters';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleNavigateToProfile = () => {
    const role = user?.role?.toLowerCase();
    navigate(`/${role}/profile`);
  };

  return (
    <Layout>
      <div className="settings-page">
        <div className="page-header">
          <h1>Settings</h1>
        </div>

        <div className="settings-sections">
          <Card title="Account Settings" className="settings-section">
            <div className="account-info">
              <p><strong>Role:</strong> {formatUserRole(user?.role)}</p>
              <p><strong>Email:</strong> {user?.email}</p>
            </div>
            <Button variant="primary" onClick={handleNavigateToProfile}>
              Manage Profile
            </Button>
          </Card>

          <Card title="Appearance" className="settings-section">
            <div className="theme-setting">
              <label>Theme</label>
              <div className="theme-options">
                <button
                  className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => theme !== 'light' && toggleTheme()}
                >
                  Light
                </button>
                <button
                  className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => theme !== 'dark' && toggleTheme()}
                >
                  Dark
                </button>
              </div>
            </div>
          </Card>

          <Card title="Quick Links" className="settings-section">
            <div className="quick-links">
              <Button variant="outline" onClick={() => navigate('/settings')}>
                General Settings
              </Button>
              <Button variant="outline" onClick={handleNavigateToProfile}>
                Profile Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;

