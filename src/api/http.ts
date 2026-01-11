// V15-530
const BASE_URL = import.meta.env.VITE_API_URL || '/api';
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
  if (!response.ok) { const error = await response.json().catch(() => ({ message: 'Erro desconhecido' })); throw new Error(error.message); }
  return response.json();
}
export const http = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data: any) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: any) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data: any) => request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
