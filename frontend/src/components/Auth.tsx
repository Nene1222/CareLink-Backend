import React, { useState, useEffect } from 'react';
import { CircularProgress, Alert } from '@mui/material';
import { Person, VisibilityOff, Visibility, CheckCircle, Error } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import validator from 'email-validator';
import { useAuth } from '../context/AuthContext';
import authService from '../services/api/authService';

type AuthPage = 'login' | 'register' | 'register_otp' | 'forget_password_email' | 'forget_password_otp';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  registerOTP: string;
  forgetPasswordOTP: string;
}

interface ValidationMessages {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Modern OTP Input Component
interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  success?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  error = false,
  success = false
}) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const handleChange = (index: number, inputValue: string) => {
    // Only allow digits
    if (!/^\d*$/.test(inputValue)) return;

    const newValue = value.split('');
    newValue[index] = inputValue;
    const updatedValue = newValue.join('');

    // Auto-advance to next box
    if (inputValue && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    onChange(updatedValue.slice(0, length));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      // Move to previous box on backspace
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasteData);
  };

  const getInputClass = (index: number) => {
    const baseClass = "w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none transition-all duration-200";

    if (success) {
      return `${baseClass} border-green-500 bg-green-50 text-green-700`;
    }
    if (error) {
      return `${baseClass} border-red-500 bg-red-50 text-red-700 animate-pulse`;
    }
    if (focusedIndex === index) {
      return `${baseClass} border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200`;
    }
    if (value[index]) {
      return `${baseClass} border-gray-400 bg-gray-50 text-gray-800`;
    }
    return `${baseClass} border-gray-300 hover:border-gray-400`;
  };

  return (
    <div className="flex justify-center gap-2 mb-4">
      {Array.from({ length }, (_, index) => (
        <div key={index} className="relative">
          <input
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(-1)}
            disabled={disabled}
            className={getInputClass(index)}
          />
          {success && value[index] && (
            <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500 bg-white rounded-full" />
          )}
          {error && (
            <Error className="absolute -top-1 -right-1 w-4 h-4 text-red-500 bg-white rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
};

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { login, setError, clearError } = useAuth();

  const [page, setPage] = useState<AuthPage>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    registerOTP: '',
    forgetPasswordOTP: '',
  });

  const [validationMessages, setValidationMessages] = useState<ValidationMessages>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(0);

  const initialErrorObj = {
    login: '',
    register: '',
    sendRegisterOTP: '',
    sendForgetPasswordOTP: '',
    changePassword: '',
  };

  const [errorObj, setErrorObj] = useState(initialErrorObj);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Validation states
  const registerValidated = validationMessages.name === '' &&
    validationMessages.email === '' &&
    validationMessages.password === '' &&
    validationMessages.confirmPassword === '';

  const loginValidated = validationMessages.email === '' && validationMessages.password === '';
  const changePasswordValidated = validationMessages.email === '' && validationMessages.password === '';

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage('');
  };

  // Validation functions
  const nameBlur = () => {
    if (formData.name === '') {
      setValidationMessages(prev => ({ ...prev, name: 'Name field is required' }));
    } else if (formData.name.length < 3) {
      setValidationMessages(prev => ({ ...prev, name: 'Name must be at least 3 characters' }));
    } else {
      setValidationMessages(prev => ({ ...prev, name: '' }));
    }
  };

  const emailBlur = () => {
    if (formData.email === '') {
      setValidationMessages(prev => ({ ...prev, email: 'Email field is required' }));
    } else if (!validator.validate(formData.email)) {
      setValidationMessages(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setValidationMessages(prev => ({ ...prev, email: '' }));
    }
  };

  const passwordBlur = () => {
    if (formData.password === '') {
      setValidationMessages(prev => ({ ...prev, password: 'Password field is required' }));
    } else if (formData.password.length < 5) {
      setValidationMessages(prev => ({ ...prev, password: 'Password must be at least 5 characters' }));
    } else {
      setValidationMessages(prev => ({ ...prev, password: '' }));
    }
  };

  const confirmPasswordBlur = () => {
    if (formData.confirmPassword === '') {
      setValidationMessages(prev => ({ ...prev, confirmPassword: 'Confirm password field is required' }));
    } else if (formData.confirmPassword.length < 5) {
      setValidationMessages(prev => ({ ...prev, confirmPassword: 'Confirm password must be at least 5 characters' }));
    } else {
      setValidationMessages(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  // Authentication handlers
  const handleLogin = async () => {
    if (!loginValidated) return;

    setIsLoading(true);
    setErrorObj(initialErrorObj);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        login(response.result);
        navigate('/');
      } else {
        setErrorObj(prev => ({ ...prev, login: response.message || 'Login failed' }));
      }
    } catch (error: any) {
      setErrorObj(prev => ({
        ...prev,
        login: error.response?.data?.message || 'Login failed'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRegisterOTP = async () => {
    if (!registerValidated) return;

    if (formData.password !== formData.confirmPassword) {
      setErrorObj(prev => ({ ...prev, sendRegisterOTP: 'Password and confirm password should match' }));
      return;
    }

    setIsLoading(true);
    setErrorObj(initialErrorObj);

    try {
      const response = await authService.sendRegisterOTP(formData.email);
      if (response.success) {
        setPage('register_otp');
        setCountdown(60); // Start 60 second countdown
      } else {
        setErrorObj(prev => ({ ...prev, sendRegisterOTP: response.message || 'Failed to send OTP' }));
        if (error.response?.status === 429) {
          setCountdown(error.response.data.retryAfter || 60);
        }
      }
    } catch (error: any) {
      setErrorObj(prev => ({
        ...prev,
        sendRegisterOTP: error.response?.data?.message || 'Failed to send OTP'
      }));
      if (error.response?.status === 429) {
        setCountdown(error.response.data.retryAfter || 60);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setErrorObj(initialErrorObj);

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: formData.registerOTP,
      });

      if (response.success) {
        login(response.result);
        navigate('/');
      } else {
        setErrorObj(prev => ({ ...prev, register: response.message || 'Registration failed' }));
      }
    } catch (error: any) {
      setErrorObj(prev => ({
        ...prev,
        register: error.response?.data?.message || 'Registration failed'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendForgetPasswordOTP = async () => {
    setIsLoading(true);
    setErrorObj(initialErrorObj);

    try {
      const response = await authService.sendForgetPasswordOTP(formData.email);
      if (response.success) {
        setPage('forget_password_otp');
        setCountdown(60); // Start 60 second countdown
      } else {
        setErrorObj(prev => ({ ...prev, sendForgetPasswordOTP: response.message || 'Failed to send OTP' }));
        if (error.response?.status === 429) {
          setCountdown(error.response.data.retryAfter || 60);
        }
      }
    } catch (error: any) {
      setErrorObj(prev => ({
        ...prev,
        sendForgetPasswordOTP: error.response?.data?.message || 'Failed to send OTP'
      }));
      if (error.response?.status === 429) {
        setCountdown(error.response.data.retryAfter || 60);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!changePasswordValidated) return;

    setIsLoading(true);
    setErrorObj(initialErrorObj);

    try {
      const response = await authService.changePassword({
        email: formData.email,
        password: formData.password,
        otp: formData.forgetPasswordOTP,
      });

      if (response.success) {
        setPage('login');
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          registerOTP: '',
          forgetPasswordOTP: '',
        });
        setValidationMessages({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        setErrorObj(prev => ({ ...prev, changePassword: response.message || 'Password change failed' }));
      }
    } catch (error: any) {
      setErrorObj(prev => ({
        ...prev,
        changePassword: error.response?.data?.message || 'Password change failed'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress className="w-12 h-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 border border-blue-100 relative overflow-hidden">
        {/* Medical cross background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-blue-600">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>

        {/* Header with Clinic Branding */}
        {(page === 'login' || page === 'register') && (
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex justify-center items-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">CareLink Clinic</h1>
            <p className="text-gray-600 text-sm">Your Health, Our Priority</p>
          </div>
        )}

        {/* Register Form */}
        {page === 'register' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

            {/* Name Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Person className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={nameBlur}
                  className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50/50 transition-all duration-200"
                />
              </div>
              {validationMessages.name && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <Error className="w-4 h-4" />
                  {validationMessages.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={emailBlur}
                  className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50/50 transition-all duration-200"
                />
              </div>
              {validationMessages.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <Error className="w-4 h-4" />
                  {validationMessages.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password (min. 5 characters)"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={passwordBlur}
                className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50/50 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-blue-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
              {validationMessages.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <Error className="w-4 h-4" />
                  {validationMessages.password}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onBlur={confirmPasswordBlur}
                className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50/50 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-blue-400 hover:text-blue-600 transition-colors"
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </button>
              {validationMessages.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <Error className="w-4 h-4" />
                  {validationMessages.confirmPassword}
                </p>
              )}
            </div>

            {/* Error Message */}
            {errorObj.sendRegisterOTP && (
              <Alert severity="error" className="text-sm">
                {errorObj.sendRegisterOTP}
              </Alert>
            )}

            {/* Register Button */}
            <button
              onClick={handleSendRegisterOTP}
              disabled={!registerValidated}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Account
            </button>

            {/* Switch to Login */}
            <p className="text-center text-gray-600 mt-6">
              Already have an account?{' '}
              <button
                onClick={() => setPage('login')}
                className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        )}

        {/* Register OTP Verification */}
        {page === 'register_otp' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Verify Your Email</h2>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">
                We sent a 6-digit code to
              </p>
              <p className="font-semibold text-gray-800">
                {formData.email}
              </p>
            </div>

            <OTPInput
              value={formData.registerOTP}
              onChange={(value) => handleInputChange('registerOTP', value)}
              error={!!errorObj.register}
              success={false}
            />

            <p className="text-center text-sm text-gray-500 mb-4">
              Enter the 6-digit code sent to your email
            </p>

            {errorObj.register && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <Error className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700 text-sm">{errorObj.register}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleRegister}
              disabled={isLoading || formData.registerOTP.length !== 6}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} className="text-white" />
                  Verifying...
                </>
              ) : (
                'Verify & Complete Registration'
              )}
            </button>

            <div className="text-center">
              {countdown === 0 ? (
                <button
                  onClick={handleSendRegisterOTP}
                  className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors"
                >
                  Didn't receive code? Resend
                </button>
              ) : (
                <p className="text-gray-500 text-sm">
                  Resend code in <span className="font-semibold text-blue-600">{countdown}</span> seconds
                </p>
              )}
            </div>

            <button
              onClick={() => setPage('register')}
              className="w-full text-gray-600 py-2 rounded-lg font-semibold hover:text-gray-800 transition-colors"
            >
              Wrong Email?
            </button>
          </div>
        )}

        {/* Login Form */}
        {page === 'login' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

            {/* Email Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onBlur={emailBlur}
                  className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50/50 transition-all duration-200"
                />
              </div>
              {validationMessages.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <Error className="w-4 h-4" />
                  {validationMessages.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={passwordBlur}
                className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50/50 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-blue-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
              {validationMessages.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <Error className="w-4 h-4" />
                  {validationMessages.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <button
                onClick={() => setPage('forget_password_email')}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Error Message */}
            {errorObj.login && (
              <Alert severity="error" className="text-sm">
                {errorObj.login}
              </Alert>
            )}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={!loginValidated}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Sign In
            </button>

            {/* Switch to Register */}
            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{' '}
              <button
                onClick={() => setPage('register')}
                className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>
        )}

        {/* Forget Password Email */}
        {page === 'forget_password_email' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>

            <p className="text-center text-gray-600 mb-4">
              Enter your registered email address
            </p>

            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={emailBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {errorObj.sendForgetPasswordOTP && (
              <Alert severity="error" className="text-sm">
                {errorObj.sendForgetPasswordOTP}
              </Alert>
            )}

            <button
              onClick={handleSendForgetPasswordOTP}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Send Reset Code
            </button>

            <button
              onClick={() => setPage('login')}
              className="w-full text-gray-600 py-2 rounded-lg font-semibold hover:text-gray-800 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {/* Forget Password OTP */}
        {page === 'forget_password_otp' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Your Password</h2>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">
                We sent a 6-digit code to
              </p>
              <p className="font-semibold text-gray-800">
                {formData.email}
              </p>
            </div>

            <OTPInput
              value={formData.forgetPasswordOTP}
              onChange={(value) => handleInputChange('forgetPasswordOTP', value)}
              error={!!errorObj.changePassword}
              success={false}
            />

            <p className="text-center text-sm text-gray-500 mb-4">
              Enter the 6-digit code sent to your email
            </p>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={passwordBlur}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>

            {errorObj.changePassword && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <Error className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700 text-sm">{errorObj.changePassword}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleChangePassword}
              disabled={isLoading || !changePasswordValidated || formData.forgetPasswordOTP.length !== 6}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} className="text-white" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>

            <div className="text-center">
              {countdown === 0 ? (
                <button
                  onClick={handleSendForgetPasswordOTP}
                  className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors"
                >
                  Didn't receive code? Resend
                </button>
              ) : (
                <p className="text-gray-500 text-sm">
                  Resend code in <span className="font-semibold text-blue-600">{countdown}</span> seconds
                </p>
              )}
            </div>

            <button
              onClick={() => setPage('forget_password_email')}
              className="w-full text-gray-600 py-2 rounded-lg font-semibold hover:text-gray-800 transition-colors"
            >
              Wrong Email?
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
