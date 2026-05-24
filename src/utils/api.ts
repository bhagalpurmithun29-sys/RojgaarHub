import axios from 'axios';

// Configure the base API URL (default to localhost:5000/api if not in env)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Allows sending secure cookies if needed
  withCredentials: true 
});

// Request Interceptor: Attach JWT Token to every request
api.interceptors.request.use(
  (config) => {
    // We only access localStorage in the browser (client-side)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the server returns 401 (Unauthorized), the token might be expired
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear local storage and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_role');
        
        // Prevent infinite redirect loops if we are already on login
        if (window.location.pathname !== '/login') {
           window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
