import axios from 'axios';

/**
 * Axios HTTP Client Instance for Local Mart Backend API
 * Handles base URL configuration and JWT token authorization headers.
 */
const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor: Automatically attaches JWT bearer token to outgoing HTTP requests
 * if user is authenticated.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('localmart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
