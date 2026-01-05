const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
interface RequestOptions { method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; body?: any; headers?: Record<string, string>; }
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  constructor(baseUrl: string = API_BASE_URL) { this.baseUrl = baseUrl; this.defaultHeaders = { "Content-Type": "application/json" }; }
  setToken(token: string) { this.defaultHeaders["Authorization"] = `Bearer ${token}`; }
  clearToken() { delete this.defaultHeaders["Authorization"]; }
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> { const { method = "GET", body, headers = {} } = options; const response = await fetch(`${this.baseUrl}${endpoint}`, { method, headers: { ...this.defaultHeaders, ...headers }, body: body ? JSON.stringify(body) : undefined }); if (!response.ok) { const error = await response.json().catch(() => ({ message: "Erro desconhecido" })); throw new Error(error.message || `Erro ${response.status}`); } return response.json(); }
  get<T>(endpoint: string) { return this.request<T>(endpoint); }
  post<T>(endpoint: string, body: any) { return this.request<T>(endpoint, { method: "POST", body }); }
  put<T>(endpoint: string, body: any) { return this.request<T>(endpoint, { method: "PUT", body }); }
  patch<T>(endpoint: string, body: any) { return this.request<T>(endpoint, { method: "PATCH", body }); }
  delete<T>(endpoint: string) { return this.request<T>(endpoint, { method: "DELETE" }); }
}
export const apiClient = new ApiClient();
export default apiClient;
