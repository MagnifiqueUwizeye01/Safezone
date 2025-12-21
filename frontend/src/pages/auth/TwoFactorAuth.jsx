import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import authService from '../../api/services/authService';
import { validateOTP } from '../../utils/validation';

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const { completeLogin } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCode(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateOTP(code)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      // Get user ID from localStorage (set during login)
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        setError('User session not found. Please login again.');
        setLoading(false);
        return;
      }

      const result = await authService.verify2FA(user.id, code);
      console.log('2FA verification result:', result);
      
      if (result.success) {
        // 2FA verified - complete login by setting user, token, and authentication state
        const finalUser = result.user || user;
        const finalToken = result.token || localStorage.getItem('token');
        
        console.log('Completing login with:', { finalUser, finalToken });
        
        // Complete the login process (sets user, token, and isAuthenticated)
        completeLogin(finalUser, finalToken);
        
        // Navigate immediately - React state updates are synchronous for navigation
        const role = finalUser?.role?.toLowerCase();
        if (role) {
          console.log('Navigating to dashboard for role:', role);
          navigate(`/${role}/dashboard`, { replace: true });
        } else {
          setError('Unable to determine user role. Please contact support.');
        }
      } else {
        setError(result.message || result.error || 'Invalid verification code');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Two-Factor Authentication</h1>
          <p className="text-lg text-slate-600">Enter the 6-digit code sent to your email</p>
        </div>

        {error && (
          <div className="mb-4">
            <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Verification Code"
              name="code"
              type="text"
              value={code}
              onChange={handleChange}
              required
              placeholder="000000"
              maxLength={6}
            />

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Verify
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;

