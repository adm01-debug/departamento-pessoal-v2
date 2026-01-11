// V15-037: src/api/index.ts
export { api } from './client';
export { apiClient } from './apiClient';
export { request, get, post, put, del } from './methods';
export { useApi } from './hooks/useApi';
export { ApiProvider } from './ApiProvider';
export type { ApiConfig, ApiResponse, ApiError } from './types';
