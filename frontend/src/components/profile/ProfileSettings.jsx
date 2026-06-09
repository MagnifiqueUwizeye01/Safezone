import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import authService from '../../api/services/authService';
import { validateForm } from '../../utils/validation';
import { Shield, ShieldOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfileSettings = ({ user, onUpdatePassword, onUpdatePreferences }) => {
  const { updateUser } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    ...user?.profile?.notificationPreferences,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorMessage, setTwoFactorMessage] = useState(null);
  const [twoFactorError, setTwoFactorError] = useState(null);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    const rules = {
      currentPassword: { required: true },
      newPassword: { required: true, password: true, minLength: 8 },
      confirmPassword: { required: true },
    };

    const validation = validateForm(passwordData, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await onUpdatePassword(passwordData);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setErrors({ currentPassword: 'Current password is incorrect' });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdatePreferences(preferences);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    if (!user?.id) {
      setTwoFactorError('User ID not found');
      return;
    }

    setTwoFactorLoading(true);
    setTwoFactorError(null);
    setTwoFactorMessage(null);

    try {
      if (twoFactorEnabled) {
        // Disable 2FA
        const result = await authService.disable2FA(user.id);
        if (result.success) {
          setTwoFactorEnabled(false);
          setTwoFactorMessage('2FA has been disabled successfully');
          // Update user in context, which will handle localStorage update with clean object
          const updatedUser = { ...user, twoFactorEnabled: false };
          updateUser(updatedUser); // Use updateUser from AuthContext
        } else {
          setTwoFactorError(result.message || 'Failed to disable 2FA');
        }
      } else {
        // Enable 2FA
        const result = await authService.enable2FA(user.id);
        if (result.success) {
          setTwoFactorEnabled(true);
          setTwoFactorMessage('2FA has been enabled. Please verify with the code sent to your email.');
          // Update user in context, which will handle localStorage update with clean object
          const updatedUser = { ...user, twoFactorEnabled: true };
          updateUser(updatedUser); // Use updateUser from AuthContext
        } else {
          setTwoFactorError(result.message || 'Failed to enable 2FA');
        }
      }
    } catch (error) {
      setTwoFactorError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setTwoFactorLoading(false);
      // Clear messages after 5 seconds
      setTimeout(() => {
        setTwoFactorMessage(null);
        setTwoFactorError(null);
      }, 5000);
    }
  };

  useEffect(() => {
    setTwoFactorEnabled(user?.twoFactorEnabled || false);
  }, [user]);

  return (
    <div className="profile-settings space-y-6">
      <Card title="Two-Factor Authentication" className="settings-section">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-3">
              {twoFactorEnabled ? (
                <Shield className="w-6 h-6 text-emerald-600" />
              ) : (
                <ShieldOff className="w-6 h-6 text-slate-400" />
              )}
              <div>
                <h3 className="font-semibold text-slate-900">
                  {twoFactorEnabled ? '2FA is Enabled' : '2FA is Disabled'}
                </h3>
                <p className="text-sm text-slate-600">
                  {twoFactorEnabled
                    ? 'Your account is protected with two-factor authentication'
                    : 'Enable two-factor authentication for added security'}
                </p>
              </div>
            </div>
            <Button
              variant={twoFactorEnabled ? 'outline' : 'primary'}
              onClick={handleToggle2FA}
              loading={twoFactorLoading}
              disabled={twoFactorLoading}
            >
              {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
          </div>
          
          {twoFactorMessage && (
            <Alert type="success" message={twoFactorMessage} dismissible onClose={() => setTwoFactorMessage(null)} />
          )}
          
          {twoFactorError && (
            <Alert type="danger" message={twoFactorError} dismissible onClose={() => setTwoFactorError(null)} />
          )}
        </div>
      </Card>

      <Card title="Change Password" className="settings-section">
        <form onSubmit={handlePasswordSubmit}>
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            error={errors.currentPassword}
            required
          />
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            error={errors.newPassword}
            required
          />
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            error={errors.confirmPassword}
            required
          />
          <Button type="submit" variant="primary" loading={loading}>
            Update Password
          </Button>
        </form>
      </Card>

      <Card title="Notification Preferences" className="settings-section">
        <form onSubmit={handlePreferencesSubmit}>
          <div className="form-check">
            <input
              type="checkbox"
              id="emailNotifications"
              name="emailNotifications"
              checked={preferences.emailNotifications}
              onChange={handlePreferenceChange}
              className="form-check-input"
            />
            <label htmlFor="emailNotifications" className="form-check-label">
              Email Notifications
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              id="smsNotifications"
              name="smsNotifications"
              checked={preferences.smsNotifications}
              onChange={handlePreferenceChange}
              className="form-check-input"
            />
            <label htmlFor="smsNotifications" className="form-check-label">
              SMS Notifications
            </label>
          </div>
          <Button type="submit" variant="primary" loading={loading}>
            Save Preferences
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ProfileSettings;

