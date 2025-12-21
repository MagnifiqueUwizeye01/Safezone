import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import authService from '../../api/services/authService';
import { validateForm } from '../../utils/validation';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false); // Prevent duplicate submissions

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({});
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (loading || submitted) {
      return;
    }
    
    setError(null);
    setSuccess(false);

    const rules = {
      email: {
        required: true,
        email: true,
      },
    };

    const validation = validateForm({ email }, rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setSubmitted(true);
    
    try {
      const result = await authService.forgotPassword(email);
      
      // Debug: Log the response to see what we're getting
      console.log('=== FORGOT PASSWORD RESPONSE ===');
      console.log('Full response:', JSON.stringify(result, null, 2));
      console.log('Success value:', result?.success);
      console.log('Success type:', typeof result?.success);
      console.log('Message:', result?.message);
      
      // Handle response - backend returns { success: boolean, message: string }
      // Check for success property - be very explicit and handle all cases
      const hasSuccessFlag = result && (
        result.success === true || 
        result.success === 'true' ||
        result.success === 1 ||
        String(result.success).toLowerCase() === 'true'
      );
      
      // Fallback: Check if message indicates success (for debugging)
      const messageIndicatesSuccess = result?.message && (
        result.message.toLowerCase().includes('sent') ||
        result.message.toLowerCase().includes('otp') ||
        result.message.toLowerCase().includes('success')
      );
      
      // Use success flag if present, otherwise fallback to message check (but only if success is not explicitly false)
      const isSuccess = hasSuccessFlag || (messageIndicatesSuccess && result?.success !== false);
      
      console.log('Has success flag?', hasSuccessFlag);
      console.log('Message indicates success?', messageIndicatesSuccess);
      console.log('Final isSuccess?', isSuccess);
      
      if (isSuccess) {
        console.log('✅ Setting success to TRUE');
        setSuccess(true);
        setError(null); // Clear any errors
      } else {
        console.log('❌ Success is false, showing error');
        // Backend returned success: false (e.g., email not found)
        setError(result?.message || 'Failed to send password reset OTP');
        setSuccess(false);
      }
    } catch (err) {
      // Debug: Log the error to see what's happening
      console.error('=== FORGOT PASSWORD ERROR ===');
      console.error('Error object:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error message:', err.message);
      
      // Handle HTTP errors (400, 500, etc.)
      const errorData = err.response?.data;
      
      // Check if it's a 400 with success: false (email not found)
      if (err.response?.status === 400 && errorData) {
        if (errorData.success === false) {
          setError(errorData.message || 'Email not found in our system');
          setSuccess(false);
        } else if (errorData.success === true) {
          // Edge case: 400 response but success is true
          console.log('✅ 400 response but success: true, setting success state');
          setSuccess(true);
          setError(null);
        } else {
          setError(errorData.message || errorData.error || 'Failed to send password reset OTP');
          setSuccess(false);
        }
      } else {
        // Other errors (network, 500, etc.)
        setError(errorData?.message || errorData?.error || 'Failed to send password reset OTP. Please try again.');
        setSuccess(false);
      }
    } finally {
      setLoading(false);
      // Reset submitted flag after 2 seconds to allow retry
      setTimeout(() => setSubmitted(false), 2000);
    }
  };

  const handleContinue = () => {
    // Navigate to reset password page with email in state
    navigate('/reset-password', { state: { email } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Forgot Password</h1>
            <p className="text-lg text-slate-600">Enter your email to receive a password reset OTP code</p>
          </div>

          {/* Only show error alerts when NOT in success state */}
          {error && !success && (
            <div className="mb-4">
              <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            {success ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">OTP Sent Successfully!</h2>
                  <p className="text-slate-600 mb-4">
                    We've sent a 6-digit OTP code to <span className="font-semibold text-slate-900">{email}</span>
                  </p>
                  <p className="text-sm text-slate-500 mb-6">Please check your inbox and spam folder</p>
                </div>
                
                <div className="space-y-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full"
                    onClick={handleContinue}
                  >
                    Continue to Enter OTP
                  </Button>
                  <div className="text-center">
                    <button
                      onClick={() => {
                        setSuccess(false);
                        setError(null);
                      }}
                      className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                    >
                      Resend OTP
                    </button>
                    <span className="mx-2 text-slate-400">•</span>
                    <Link to="/login" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                      Back to Login
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    placeholder="Enter your email"
                  />

                  <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                    Send OTP Code
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-600">
                    Remember your password?{' '}
                    <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Sign In
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
  );
};

export default ForgotPassword;

