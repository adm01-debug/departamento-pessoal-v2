export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
  retryDelay?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
  ok: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

class ApiService {
  private config: ApiConfig = {
    baseUrl: "",
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
  };

  private defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  configure(config: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...config };
  }

  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  setAuthToken(token: string): void {
    this.setHeader("Authorization", `Bearer ${token}`);
  }

  clearAuthToken(): void {
    this.removeHeader("Authorization");
  }

  private async request<T>(method: string, endpoint: string, data?: any, customHeaders?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = { ...this.defaultHeaders, ...this.config.headers, ...customHeaders };

    const options: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= (this.config.retries || 0); attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
        
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timeoutId);

        const responseData = await response.json().catch(() => null);
        
        return {
          data: responseData,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          ok: response.ok,
        };
      } catch (error) {
        lastError = error as Error;
        if (attempt < (this.config.retries || 0)) {
          await this.delay(this.config.retryDelay || 1000);
        }
      }
    }
    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>("GET", endpoint, undefined, headers);
  }

  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>("POST", endpoint, data, headers);
  }

  async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", endpoint, data, headers);
  }

  async patch<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", endpoint, data, headers);
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", endpoint, undefined, headers);
  }

  async upload<T>(endpoint: string, file: File, fieldName: string = "file"): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = { ...this.config.headers };
    delete headers["Content-Type"];

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    return {
      data: await response.json(),
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      ok: response.ok,
    };
  }
}

export const apiService = new ApiService();
export default apiService;
