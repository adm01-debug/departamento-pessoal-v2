// V17.2-LIB006: Local Storage Helper
export const storage = {
  get: <T>(key: string, defaultValue: T | null = null): T | null => { try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : defaultValue; } catch { return defaultValue; } },
  set: <T>(key: string, value: T): void => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { console.error('Storage error'); } },
  remove: (key: string): void => { localStorage.removeItem(key); },
  clear: (): void => { localStorage.clear(); }
};
export const sessionStorage = {
  get: <T>(key: string, defaultValue: T | null = null): T | null => { try { const item = window.sessionStorage.getItem(key); return item ? JSON.parse(item) : defaultValue; } catch { return defaultValue; } },
  set: <T>(key: string, value: T): void => { try { window.sessionStorage.setItem(key, JSON.stringify(value)); } catch { console.error('Session storage error'); } },
  remove: (key: string): void => { window.sessionStorage.removeItem(key); }
};
