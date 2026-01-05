import { apiClient } from "@/api/client";

interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
  empresaId: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    this.setTokens(response.data.token, response.data.refreshToken);
    this.setUser(response.data.user);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      this.clearAuth();
    }
  },

  async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await apiClient.post<{ token: string }>("/auth/refresh", { refreshToken });
      this.setToken(response.data.token);
      return response.data.token;
    } catch {
      this.clearAuth();
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getUser(): User | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default authService;
