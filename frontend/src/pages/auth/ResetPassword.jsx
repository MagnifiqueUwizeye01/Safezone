import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import authService from '../../api/services/authService';
import { validateForm } from '../../utils/validation';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!email) {
      // If no email in state, redirect to forgot password
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    setOtp(value);
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: null }));
    }
    setError(null);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setError(null);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP code' });
      return;
    }

    setVerifyingOtp(true);
    try {
      const result = await authService.verifyOTP(email, otp, 'PASSWORD_RESET');
      if (result.success) {
        setOtpVerified(true);
        setError(null);
      } else {
        setError(result.message || 'Invalid or expired OTP code');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP code');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    const rules = {
      password: {
        required: true,
        password: true,
        minLength: 8,
      },
      confirmPassword: {
        required: true,
      },
    };

    const validation = validateForm(formData, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(email, otp, formData.password, formData.confirmPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Password Reset Successful</h1>
            <p className="text-lg text-slate-600">Your password has been reset successfully!</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <Alert type="success" message="Password reset successfully! Redirecting to login..." />
            <div className="mt-6 text-center">
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Verify OTP
  if (!otpVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Verify OTP</h1>
            <p className="text-lg text-slate-600">Enter the 6-digit code sent to your email</p>
          </div>

          {error && (
            <div className="mb-4">
              <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <Input
                label="Email"
                name="email"
                type="email"
                value={email}
                disabled
                placeholder="Enter your email"
              />

              <Input
                label="OTP Code"
                name="otp"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                error={errors.otp}
                required
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                autoComplete="off"
                autoFocus
              />

              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                loading={verifyingOtp} 
                className="w-full"
              >
                Verify OTP
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
  }

  // Step 2: Reset Password
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Reset Password</h1>
          <p className="text-lg text-slate-600">Enter your new password</p>
        </div>

        {error && (
          <div className="mb-4">
            <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <Input
              label="New Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handlePasswordChange}
              error={errors.password}
              required
              placeholder="Enter new password"
              autoComplete="new-password"
              autoFocus
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handlePasswordChange}
              error={errors.confirmPassword}
              required
              placeholder="Confirm new password"
              autoComplete="new-password"
            />

            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              loading={loading} 
              className="w-full"
            >
              Reset Password
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

export default ResetPassword;

