import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:3000/api/auth';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  otp: string;
}

export interface ChangePasswordData {
  email: string;
  password: string;
  otp: string;
}

export interface AuthResponse {
  result?: any;
  message: string;
  success: boolean;
}

// Create axios instance with auth header interceptor
const authApi = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
authApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      Cookies.remove('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Send OTP for registration
  sendRegisterOTP: async (email: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/send-register-otp`, { email });
    return response.data;
  },

  // Register user with OTP verification
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axios.put(`${API_BASE_URL}/register`, data);
    if (response.data.success && response.data.result?.tokens) {
      // Store token in cookie
      const authToken = response.data.result.tokens.find(
        (token: any) => token.name === 'auth_token'
      );
      if (authToken) {
        Cookies.set('token', authToken.token, { expires: 7 }); // 7 days
      }
    }
    return response.data;
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.put(`${API_BASE_URL}/login`, data);
    if (response.data.success && response.data.result?.tokens) {
      // Store token in cookie
      const authToken = response.data.result.tokens.find(
        (token: any) => token.name === 'auth_token'
      );
      if (authToken) {
        Cookies.set('token', authToken.token, { expires: 7 }); // 7 days
      }
    }
    return response.data;
  },

  // Send OTP for password reset
  sendForgetPasswordOTP: async (email: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/send-forget-pass-otp`, { email });
    return response.data;
  },

  // Change password with OTP verification
  changePassword: async (data: ChangePasswordData): Promise<AuthResponse> => {
    const response = await axios.put(`${API_BASE_URL}/change-password`, data);
    return response.data;
  },

  // Get all users (admin function)
  getAllUsers: async (): Promise<AuthResponse> => {
    const response = await authApi.get('/get-all-users');
    return response.data;
  },

  // Delete all users (admin function)
  deleteAllUsers: async (): Promise<AuthResponse> => {
    const response = await authApi.delete('/delete_all_users');
    return response.data;
  },

  // Logout (client-side cleanup)
  logout: () => {
    Cookies.remove('token');
    localStorage.removeItem('user');
  }
};

export default authService;
