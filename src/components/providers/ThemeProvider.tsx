/**
 * @fileoverview Provider de tema para dark mode
 * @module components/providers/ThemeProvider
 */
import { createContext, useContext, type ReactNode } from 'react';
import { useTheme, type Theme } from '@/hooks/useTheme';

/** Contexto do tema */
interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Props do ThemeProvider */
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

/**
 * Provider para gerenciamento de tema
 */
export function ThemeProvider({ children, defaultTheme = 'system' }: ThemeProviderProps): JSX.Element {
  const themeValue = useTheme();

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de tema
 */
export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
