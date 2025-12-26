import { createContext, useContext, useState, ReactNode } from 'react';
interface Settings { theme: 'light' | 'dark'; language: string; dateFormat: string; }
interface SettingsContextType { settings: Settings; updateSettings: (s: Partial<Settings>) => void; }
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
export function SettingsProvider({ children }: { children: ReactNode }) { const [settings, setSettings] = useState<Settings>({ theme: 'light', language: 'pt-BR', dateFormat: 'dd/MM/yyyy' }); const updateSettings = (s: Partial<Settings>) => setSettings(prev => ({ ...prev, ...s })); return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>; }
export function useSettings() { const ctx = useContext(SettingsContext); if (!ctx) throw new Error('useSettings must be used within SettingsProvider'); return ctx; }
