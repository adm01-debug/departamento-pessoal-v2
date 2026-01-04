export interface AppConfig {
  app: { name: string; version: string; environment: string; debug: boolean };
  api: { baseUrl: string; timeout: number; retries: number };
  auth: { tokenExpiry: number; refreshThreshold: number; maxSessions: number };
  features: Record<string, boolean>;
  ui: { theme: string; language: string; dateFormat: string; currency: string };
  notifications: { email: boolean; push: boolean; sms: boolean };
  storage: { maxFileSize: number; allowedTypes: string[] };
}

const defaultConfig: AppConfig = {
  app: { name: "Departamento Pessoal", version: "1.0.0", environment: "development", debug: false },
  api: { baseUrl: "/api", timeout: 30000, retries: 3 },
  auth: { tokenExpiry: 3600000, refreshThreshold: 300000, maxSessions: 5 },
  features: { darkMode: true, notifications: true, analytics: true, beta: false },
  ui: { theme: "light", language: "pt-BR", dateFormat: "DD/MM/YYYY", currency: "BRL" },
  notifications: { email: true, push: true, sms: false },
  storage: { maxFileSize: 10485760, allowedTypes: ["image/*", "application/pdf", ".doc", ".docx", ".xls", ".xlsx"] },
};

class ConfigService {
  private config: AppConfig = { ...defaultConfig };
  private listeners: Map<string, Set<(value: any) => void>> = new Map();

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  set<K extends keyof AppConfig>(key: K, value: AppConfig[K]): void {
    this.config[key] = value;
    this.notify(key, value);
    this.persist();
  }

  getValue<T>(path: string): T | undefined {
    const parts = path.split(".");
    let current: any = this.config;
    for (const part of parts) {
      if (current === undefined) return undefined;
      current = current[part];
    }
    return current as T;
  }

  setValue(path: string, value: any): void {
    const parts = path.split(".");
    let current: any = this.config;
    for (let i = 0; i < parts.length - 1; i++) {
      if (current[parts[i]] === undefined) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    this.notify(path, value);
    this.persist();
  }

  getAll(): AppConfig {
    return { ...this.config };
  }

  reset(): void {
    this.config = { ...defaultConfig };
    this.persist();
  }

  merge(partial: Partial<AppConfig>): void {
    this.config = this.deepMerge(this.config, partial);
    this.persist();
  }

  private deepMerge(target: any, source: any): any {
    const output = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        output[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }
    return output;
  }

  subscribe(key: string, callback: (value: any) => void): () => void {
    if (!this.listeners.has(key)) this.listeners.set(key, new Set());
    this.listeners.get(key)!.add(callback);
    return () => this.listeners.get(key)?.delete(callback);
  }

  private notify(key: string, value: any): void {
    this.listeners.get(key)?.forEach(cb => cb(value));
    this.listeners.get("*")?.forEach(cb => cb({ key, value }));
  }

  private persist(): void {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("app_config", JSON.stringify(this.config));
    }
  }

  load(): void {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("app_config");
      if (saved) {
        try {
          this.config = this.deepMerge(defaultConfig, JSON.parse(saved));
        } catch (e) {
          console.error("[Config] Failed to load:", e);
        }
      }
    }
  }

  isFeatureEnabled(feature: string): boolean {
    return this.config.features[feature] ?? false;
  }

  enableFeature(feature: string): void {
    this.config.features[feature] = true;
    this.persist();
  }

  disableFeature(feature: string): void {
    this.config.features[feature] = false;
    this.persist();
  }

  isDevelopment(): boolean {
    return this.config.app.environment === "development";
  }

  isProduction(): boolean {
    return this.config.app.environment === "production";
  }
}

export const configService = new ConfigService();
configService.load();
export default configService;
