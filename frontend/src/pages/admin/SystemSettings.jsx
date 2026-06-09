import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { useTheme } from '../../context/ThemeContext';

const SystemSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    siteName: 'SafeZone',
    maintenanceMode: false,
    allowRegistration: true,
    maxReportsPerUser: 100,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    setTimeout(() => {
      setLoading(false);
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
            <p className="text-gray-600">Configure system-wide settings and preferences</p>
          </div>

          {error && (
            <div className="mb-6">
              <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
            </div>
          )}
          {success && (
            <div className="mb-6">
              <Alert type="success" message={success} dismissible onClose={() => setSuccess(null)} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
              <div className="space-y-4">
                <Input
                  label="Site Name"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="maintenanceMode" className="ml-2 text-sm font-medium text-gray-700">
                    Maintenance Mode
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowRegistration"
                    name="allowRegistration"
                    checked={settings.allowRegistration}
                    onChange={handleChange}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="allowRegistration" className="ml-2 text-sm font-medium text-gray-700">
                    Allow User Registration
                  </label>
                </div>
                <Input
                  label="Max Reports Per User"
                  name="maxReportsPerUser"
                  type="number"
                  value={settings.maxReportsPerUser}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        theme === 'light'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => theme !== 'light' && toggleTheme()}
                    >
                      Light
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        theme === 'dark'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => theme !== 'dark' && toggleTheme()}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="primary" onClick={handleSave} loading={loading}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SystemSettings;

