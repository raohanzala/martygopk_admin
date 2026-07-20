import axios from 'axios';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    console.log(token, 'AXIOS TOKEN')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // FormData must be sent as multipart; remove default application/json so axios sets multipart/form-data + boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      if (!isLoginRequest) {
        store.dispatch(logout());
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
