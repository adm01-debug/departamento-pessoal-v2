// src/middlewares/authMiddleware.ts - Auth middleware using axios interceptors
import { storage } from '@/utils/storage';
import { axios } from '@/lib/axios';

export function setupAuthMiddleware() {
  // Request interceptor - adds auth token
  axios.interceptors.request.use(
    (config) => {
      const token = storage.get<string>('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handles 401
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        storage.remove('token');
        storage.remove('refreshToken');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}
