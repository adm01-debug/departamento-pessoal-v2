const PREFIX = "dp_";

export const storageService = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },

  clear(): void {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));
    keys.forEach((k) => localStorage.removeItem(k));
  },

  getSession<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  setSession<T>(key: string, value: T): void {
    try {
      sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to sessionStorage:", error);
    }
  },

  removeSession(key: string): void {
    sessionStorage.removeItem(PREFIX + key);
  },
};

export default storageService;
