import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api', // Adjust if backend runs on different port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    // Import store dynamically or at top if circular dependency isn't an issue. 
    // Since store imports are usually fine, we can try top level, but for safety in this file:
    // actually, let's import at top.

    // However, if I import at top, I need to make sure I add the import line. 
    // I will replace the whole file content or use a larger chunk to include imports?
    // I'll use replace_file_content and assume I can add import. 
    // Wait, I can't easily add import at top with this tool if I target the middle.
    // I will use replace_file_content on the whole file or large chunk.

    // Better strategy: read the token from useAuthStore.getState().token
    // But I need to import useAuthStore.

    // CHECK if I can import useAuthStore without circular dependency. 
    // useAuthStore doesn't import api. So it's fine.

    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
        useAuthStore.getState().logout();
      }
      if (error.response.status === 429) {
        console.warn('Rate limit exceeded');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
