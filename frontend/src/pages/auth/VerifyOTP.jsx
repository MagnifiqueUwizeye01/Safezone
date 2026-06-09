import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import authService from '../../api/services/authService';
import { validateOTP } from '../../utils/validation';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateOTP(formData.otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.verifyOTP(formData.email, formData.otp);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.error || 'Invalid OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Verify OTP</h1>
          <p className="text-lg text-slate-600">Enter the OTP sent to your email</p>
        </div>

        {error && (
          <div className="mb-4">
            <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />

            <Input
              label="OTP Code"
              name="otp"
              type="text"
              value={formData.otp}
              onChange={handleChange}
              required
              placeholder="000000"
              maxLength={6}
            />

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
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
};

export default VerifyOTP;

