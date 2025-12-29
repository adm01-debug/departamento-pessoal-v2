/**
 * @fileoverview Context para configurações globais do sistema
 * @module contexts/SettingsContext
 * @version V8.4 - API completa e tipada
 */
import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// ============================================
// TIPOS
// ============================================

export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'pt-BR' | 'en-US' | 'es-ES';
export type DateFormat = 'dd/MM/yyyy' | 'MM/dd/yyyy' | 'yyyy-MM-dd';
export type Currency = 'BRL' | 'USD' | 'EUR';

export interface Settings {
  // Aparência
  theme: ThemeMode;
  primaryColor: string;
  fontSize: 'sm' | 'md' | 'lg';
  compactMode: boolean;
  
  // Regional
  language: Language;
  dateFormat: DateFormat;
  currency: Currency;
  timezone: string;
  
  // Notificações
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  
  // Dados
  autoSave: boolean;
  pageSize: number;
}

interface SettingsContextType {
  // Estado
  settings: Settings;
  
  // Getters específicos (para compatibilidade)
  theme: ThemeMode;
  language: Language;
  dateFormat: DateFormat;
  
  // Setters específicos
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setDateFormat: (format: DateFormat) => void;
  
  // Atualizador genérico
  updateSettings: (updates: Partial<Settings>) => void;
  
  // Reset
  resetSettings: () => void;
}

// ============================================
// DEFAULTS
// ============================================

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  primaryColor: '#3B82F6',
  fontSize: 'md',
  compactMode: false,
  language: 'pt-BR',
  dateFormat: 'dd/MM/yyyy',
  currency: 'BRL',
  timezone: 'America/Sao_Paulo',
  emailNotifications: true,
  pushNotifications: true,
  soundEnabled: true,
  autoSave: true,
  pageSize: 10,
};

const STORAGE_KEY = 'dp-system-settings';

// ============================================
// CONTEXT
// ============================================

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  // Inicializar do localStorage
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.error('[SettingsContext] Erro ao carregar configurações:', error);
    }
    return DEFAULT_SETTINGS;
  });

  // Persistir no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('[SettingsContext] Erro ao salvar configurações:', error);
    }
  }, [settings]);

  // Aplicar tema
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', settings.theme === 'dark');
    }
  }, [settings.theme]);

  // Setters específicos
  const setTheme = useCallback((theme: ThemeMode) => {
    setSettings(prev => ({ ...prev, theme }));
  }, []);

  const setLanguage = useCallback((language: Language) => {
    setSettings(prev => ({ ...prev, language }));
  }, []);

  const setDateFormat = useCallback((dateFormat: DateFormat) => {
    setSettings(prev => ({ ...prev, dateFormat }));
  }, []);

  // Atualizador genérico
  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value: SettingsContextType = {
    settings,
    theme: settings.theme,
    language: settings.language,
    dateFormat: settings.dateFormat,
    setTheme,
    setLanguage,
    setDateFormat,
    updateSettings,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  
  if (!context) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  }
  
  return context;
}

export default SettingsContext;
