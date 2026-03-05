import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

export function useThemeHook(): ThemeContextValue {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return {
    theme: theme as Theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
  };
}

export { useThemeHook as useTheme };
