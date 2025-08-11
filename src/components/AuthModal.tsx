import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Mail } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useGuestStore } from '../store/guestStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot-password'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    fullName?: string;
  }>({});
  
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword } = useAuthStore();
  const { getReturnPath, clearReturnPath } = useGuestStore();

  // Reset error and success messages when mode changes
  useEffect(() => {
    setError(null);
    setSuccessMessage(null);
    setValidationErrors({});
  }, [mode]);

  // Update mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const validateForm = () => {
    const errors: typeof validationErrors = {};
    
    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation (skip for forgot-password mode)
    if (mode !== 'forgot-password') {
      if (!password) {
        errors.password = 'Password is required';
      } else if (mode === 'signup' && password.length < 8) {
        errors.password = 'Password must be at least 8 characters long';
      }
    }
    
    // Full name validation for signup
    if (mode === 'signup' && !fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccessMessage('Password reset instructions have been sent to your email');
      // Clear the email field
      setEmail('');
    } catch (err) {
      setError('Unable to send reset instructions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    if (!validateForm()) {
      return;
    }

    // Check for too many failed attempts
    if (failedAttempts >= 5) {
      setError('Too many failed attempts. Please try again later or reset your password.');
      return;
    }
    
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else if (mode === 'signup') {
        await signUp(email, password, fullName);
      }
      
      // Reset failed attempts on successful login
      setFailedAttempts(0);
      onClose();
      
      // Check for return path and navigate
      const returnPath = getReturnPath();
      console.log('Auth success, return path:', returnPath);
      
      if (returnPath) {
        navigate(returnPath);
        clearReturnPath();
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'An error occurred';
      
      // Enhance error messages for common scenarios
      if (errorMessage.includes('Invalid login credentials')) {
        setFailedAttempts(prev => prev + 1);
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (errorMessage.includes('already registered')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFieldError = (fieldName: keyof typeof validationErrors) => {
    if (validationErrors[fieldName]) {
      return (
        <div className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          <span>{validationErrors[fieldName]}</span>
        </div>
      );
    }
    return null;
  };

  const renderForm = () => {
    if (mode === 'forgot-password') {
      return (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationErrors(prev => ({ ...prev, email: undefined }));
              }}
              className={`mt-1 block w-full rounded-lg border ${
                validationErrors.email ? 'border-red-300' : 'border-gray-300'
              } px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500`}
            />
            {renderFieldError('email')}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            ) : (
              'Send Reset Instructions'
            )}
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={() => setMode('signin')}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setValidationErrors(prev => ({ ...prev, fullName: undefined }));
              }}
              className={`mt-1 block w-full rounded-lg border ${
                validationErrors.fullName ? 'border-red-300' : 'border-gray-300'
              } px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500`}
            />
            {renderFieldError('fullName')}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setValidationErrors(prev => ({ ...prev, email: undefined }));
            }}
            className={`mt-1 block w-full rounded-lg border ${
              validationErrors.email ? 'border-red-300' : 'border-gray-300'
            } px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500`}
          />
          {renderFieldError('email')}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setValidationErrors(prev => ({ ...prev, password: undefined }));
            }}
            className={`mt-1 block w-full rounded-lg border ${
              validationErrors.password ? 'border-red-300' : 'border-gray-300'
            } px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500`}
          />
          {renderFieldError('password')}
          {mode === 'signup' && (
            <p className="mt-2 text-sm text-gray-500">
              Password must be at least 8 characters long
            </p>
          )}
          {mode === 'signin' && (
            <button
              type="button"
              onClick={() => setMode('forgot-password')}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || failedAttempts >= 5}
          className="relative w-full rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          ) : mode === 'signin' ? (
            'Sign In'
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <div className="absolute right-4 top-4">
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8">
              <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">
                {mode === 'forgot-password'
                  ? 'Reset Password'
                  : mode === 'signin'
                  ? 'Welcome back'
                  : 'Create your account'}
              </h2>

              {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 rounded-lg bg-green-50 p-4 text-sm text-green-600 flex items-center gap-2">
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {renderForm()}

              {mode !== 'forgot-password' && (
                <div className="mt-6 text-center text-sm">
                  {mode === 'signin' ? (
                    <p className="text-gray-600">
                      Don't have an account?{' '}
                      <button
                        onClick={() => {
                          setMode('signup');
                          setError(null);
                          setValidationErrors({});
                        }}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Sign up
                      </button>
                    </p>
                  ) : (
                    <p className="text-gray-600">
                      Already have an account?{' '}
                      <button
                        onClick={() => {
                          setMode('signin');
                          setError(null);
                          setValidationErrors({});
                        }}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}