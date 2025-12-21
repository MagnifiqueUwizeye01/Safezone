import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { validateForm } from '../../utils/validation';
import { API_ENDPOINTS } from '../../api/endpoints';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // SECURITY: Do NOT auto-redirect authenticated users
  // The login page should ALWAYS show the form and require credentials
  // Users should explicitly enter credentials even if they have a session
  // This prevents unauthorized access and ensures proper authentication flow

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    const rules = {
      email: {
        required: true,
        email: true,
      },
      password: {
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
      console.log('Login attempt with:', { email: formData.email });
      const result = await login(formData);
      console.log('Login result:', result);

      if (result && result.success) {
        // Get user from result (AuthContext returns it) or localStorage (fallback)
        let user = result.user;
        
        if (!user) {
          try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
              user = JSON.parse(userStr);
              console.log('Login: Retrieved user from localStorage');
            }
          } catch (parseError) {
            console.error('Error parsing user from localStorage:', parseError);
          }
        }
        
        // Check if 2FA is required
        if (result.requires2FA === true) {
          // 2FA is enabled - redirect to 2FA verification page
          console.log('Login: 2FA required, redirecting to 2FA page');
          navigate('/2fa', { replace: true });
          return; // Exit early
        }
        
        // 2FA not enabled - proceed to dashboard
        if (!user) {
          console.error('Login: No user data available after login');
          setError('Login successful but user data could not be retrieved. Please try again.');
          setLoading(false);
          return;
        }
        
        // Normalize role (handle uppercase enum values)
        let role = user.role;
        if (role) {
          role = typeof role === 'string' ? role.toLowerCase() : String(role).toLowerCase();
        }
        
        // Validate user has role
        if (!role) {
          console.error('Login: User data missing role:', user);
          setError('User account is missing role information. Please contact support.');
          setLoading(false);
          return;
        }
        
        console.log('Login: Login successful, redirecting to dashboard for role:', role);
        
        // Validate role is one of the expected values
        const validRoles = ['citizen', 'police', 'admin'];
        if (!validRoles.includes(role)) {
          console.error('Login: Invalid user role:', role, 'from user:', user);
          setError(`Invalid user role: ${role}. Please contact support.`);
          setLoading(false);
          return;
        }
        
        // Navigate to dashboard
        navigate(`/${role}/dashboard`, { replace: true });
      } else {
        // Login failed
        const errorMessage = result?.error || result?.message || 'Login failed. Please check your credentials.';
        setError(errorMessage);
        console.error('Login: Login failed:', errorMessage, 'Result:', result);
        setLoading(false);
      }
    } catch (error) {
      console.error('Login: Exception during login:', error);
      console.error('Login: Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Login failed. Please check your connection and try again.';
      
      if (error.response) {
        // Server responded with error
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          }
        } else if (error.response.status === 401) {
          errorMessage = 'Invalid email or password. Please check your credentials.';
        } else if (error.response.status === 404) {
          errorMessage = 'Login endpoint not found. Please check backend configuration.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.message) {
        // Network error or other error
        if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot connect to server. Please check your internet connection and ensure the backend is running.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);

      // Load Google Identity Services if not already loaded
      if (typeof window.google === 'undefined' || !window.google.accounts) {
        await loadGoogleScript();
      }

      // Initialize Google Sign-In
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        setError('Google Sign-In is not configured. Please contact support.');
        setLoading(false);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCallback,
      });

      // Trigger the One Tap prompt
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Failed to initiate Google sign-in. Please try again.');
      setLoading(false);
    }
  };

  const loadGoogleScript = () => {
    return new Promise((resolve, reject) => {
      if (typeof window.google !== 'undefined' && window.google.accounts) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const handleGoogleCallback = async (response) => {
    try {
      setLoading(true);
      setError(null);

      // Decode the JWT credential to get user info
      const parts = response.credential.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid Google credential format');
      }

      const payload = JSON.parse(atob(parts[1]));
      const googleUserInfo = {
        email: payload.email,
        name: payload.name || payload.given_name + ' ' + payload.family_name,
        googleId: payload.sub,
        picture: payload.picture,
      };

      // Send to backend
      const result = await authService.googleAuth(googleUserInfo);

      if (result.success && result.user) {
        // Clear localStorage first to free up space
        try {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        } catch (clearError) {
          console.warn('Error clearing localStorage before Google login:', clearError);
        }
        
        // Store user data and token (using deep clean to avoid quota issues)
        // The login function in AuthContext will handle the cleaning, but we need to store for Google auth
        const userToStore = createCleanUserObject(result.user);
        
        try {
          localStorage.setItem('user', JSON.stringify(userToStore));
          localStorage.setItem('token', result.token || `temp-token-${result.user.id}`);
        } catch (error) {
          if (error.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded. Storing minimal user data only.');
            const minimalUser = {
              id: result.user.id,
              username: result.user.username,
              email: result.user.email,
              role: result.user.role
            };
            localStorage.setItem('user', JSON.stringify(minimalUser));
            localStorage.setItem('token', result.token || `temp-token-${result.user.id}`);
          } else {
            throw error;
          }
        }
        
        // Update auth context
        const loginResult = await login({
          email: result.user.email,
          password: '', // Not needed for Google auth
        });

        if (loginResult.success) {
          // Redirect based on user role
          const role = result.user.role?.toLowerCase();
          if (role) {
            navigate(`/${role}/dashboard`, { replace: true });
          } else {
            setError('Unable to determine user role. Please contact support.');
          }
        } else {
          setError(loginResult.error || 'Login failed');
        }
      } else {
        setError(result.message || 'Google authentication failed');
      }
    } catch (error) {
      console.error('Google callback error:', error);
      setError('Failed to complete Google sign-in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-lg text-slate-600">Sign in to your SafeZone account</p>
        </div>

        {error && (
          <div className="mb-4">
            <Alert type="danger" message={error} dismissible onClose={() => setError(null)} />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setEmailFocused(true)}
              onClick={() => setEmailFocused(true)}
              error={errors.email}
              required
              placeholder="Enter your email"
              autoComplete="username"
              readOnly={!emailFocused}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setPasswordFocused(true)}
              onClick={() => setPasswordFocused(true)}
              error={errors.password}
              required
              showPasswordToggle={true}
              placeholder="Enter your password"
              autoComplete="current-password"
              readOnly={!passwordFocused}
            />

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">OR</span>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-2 hover:bg-white hover:shadow-md transition-all"
                onClick={handleGoogleSignIn}
                type="button"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-medium">Continue with Google</span>
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-700">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

