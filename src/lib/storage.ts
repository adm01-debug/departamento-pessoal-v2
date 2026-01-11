// V15-130: src/lib/storage.ts
const PREFIX = 'dp_';

export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch { return defaultValue ?? null; }
  },

  set<T>(key: string, value: T): void {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); }
    catch (e) { console.error('Storage set error:', e); }
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },

  clear(): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },

  keys(): string[] {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .map(k => k.slice(PREFIX.length));
  }
};

export const sessionStore = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(PREFIX + key);
      return item ? JSON.parse(item) : defaultValue ?? null;
    } catch { return defaultValue ?? null; }
  },

  set<T>(key: string, value: T): void {
    try { sessionStorage.setItem(PREFIX + key, JSON.stringify(value)); }
    catch (e) { console.error('Session set error:', e); }
  },

  remove(key: string): void {
    sessionStorage.removeItem(PREFIX + key);
  },

  clear(): void {
    Object.keys(sessionStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => sessionStorage.removeItem(k));
  }
};

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = React.useState<T>(() => storage.get(key) ?? initialValue);
  
  const setStoredValue = React.useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const val = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;
      storage.set(key, val);
      return val;
    });
  }, [key]);

  return [value, setStoredValue] as const;
}

import React from 'react';
