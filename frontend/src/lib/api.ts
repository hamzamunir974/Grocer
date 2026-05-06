import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_URL || window.location.origin;

// Attach token from store
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(err);
  },
);

// Helpers
export const formatPrice = (cents: number) =>
  `Rs ${(cents / 100).toFixed(0)}`;

export const formatPriceFull = (cents: number) =>
  `Rs ${(cents / 100).toLocaleString('en-PK')}`;
