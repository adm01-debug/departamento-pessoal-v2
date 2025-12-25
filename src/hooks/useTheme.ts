/**
 * @fileoverview Hook para gerenciamento de tema (dark/light mode)
 * @module hooks/useTheme
 */
import { useState, useEffect, useCallback } from 'react';

/** Tipos de tema disponíveis */
export type Theme = 'light' | 'dark' | 'system';

/** Retorno do hook */
interface UseThemeResult {
  /** Tema atual */
  theme: Theme;
  /** Tema resolvido (light ou dark) */
  resolvedTheme: 'light' | 'dark';
  /** Definir tema */
  setTheme: (theme: Theme) => void;
  /** Alternar entre light e dark */
  toggleTheme: () => void;
  /** Se está em dark mode */
  isDark: boolean;
}

const THEME_KEY = 'dp-theme';

/**
 * Hook para gerenciamento de tema
 * @returns Dados e funções de tema
 */
export function useTheme(): UseThemeResult {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem(THEME_KEY) as Theme) ?? 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Resolver tema do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateResolvedTheme = (): void => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();
    mediaQuery.addEventListener('change', updateResolvedTheme);
    return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
  }, [theme]);

  // Aplicar tema no documento
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
  };
}
