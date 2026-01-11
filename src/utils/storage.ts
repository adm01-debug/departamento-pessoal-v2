// V15-384
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => { try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : defaultValue ?? null; } catch { return defaultValue ?? null; } },
  set: <T>(key: string, value: T): void => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} },
  remove: (key: string): void => { try { localStorage.removeItem(key); } catch {} },
  clear: (): void => { try { localStorage.clear(); } catch {} },
};
