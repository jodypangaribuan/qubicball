import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Adjust if backend runs on different port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Handle unauthorized (logout)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Optional: Redirect to login
          // window.location.href = '/login';
        }
      }
      if (error.response.status === 429) {
        // Rate limited
        console.warn('Rate limit exceeded');
        // We can dispatch an event or use a toast here
      }
    }
    return Promise.reject(error);
  }
);

export default api;
