// V15-349
import { createContext, useContext, useEffect, useState } from 'react';
type Theme = 'dark' | 'light' | 'system';
interface ThemeContextType { theme: Theme; setTheme: (t: Theme) => void; }
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeProvider({ children, defaultTheme = 'system', storageKey = 'ui-theme' }: { children: React.ReactNode; defaultTheme?: Theme; storageKey?: string }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else { root.classList.add(theme); }
  }, [theme]);
  const value = { theme, setTheme: (t: Theme) => { localStorage.setItem(storageKey, t); setTheme(t); } };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => { const ctx = useContext(ThemeContext); if (!ctx) throw new Error('useTheme must be used within ThemeProvider'); return ctx; };
