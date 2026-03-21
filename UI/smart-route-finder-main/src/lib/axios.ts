import axios from 'axios';
import { useAppStore } from '../store/useAppStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    // We get the token from Zustand store
    const token = useAppStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g. token expired) -> log out
      useAppStore.getState().logout();
      // Optionally redirect to login, but Zustand state change might handle that in React Router
      console.warn('Unauthorized access. User logged out.');
    }
    return Promise.reject(error);
  }
);
