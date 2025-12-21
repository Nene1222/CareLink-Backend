import axios from 'axios';

// Create a pre-configured Axios instance
const axiosClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // important if you use cookies for JWT
});

// Request interceptor to include token automatically
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      let token: string | null = null;
      
      // 1. First try localStorage (where login stores it)
      token = localStorage.getItem('user_token');
      
      // 2. If not in localStorage, try cookies (from middleware)
      if (!token) {
        const cookies = document.cookie.split('; ');
        const tokenCookie = cookies.find((row) => row.startsWith('token='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
        }
      }
      
      // 3. Also check sessionStorage as backup
      if (!token) {
        token = sessionStorage.getItem('user_token');
      }
      
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Added token to request:', config.url, 'Token present:', !!token);
      } else {
        console.warn('No token found for request:', config.url);
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      success: response.data?.success
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      error: error.response?.data?.error || error.message,
      hasToken: !!error.config?.headers?.Authorization
    });
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('Authentication failed (401), clearing storage...');
      
      // Clear all auth data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_permissions');
        sessionStorage.removeItem('user_token');
        
        // Also clear cookie
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
      
      // Redirect to login only if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;