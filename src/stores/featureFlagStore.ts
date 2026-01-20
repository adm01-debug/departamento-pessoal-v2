// V19-024: Feature Flag Service
import { create } from 'zustand';

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number;
}

interface FeatureFlagState {
  flags: Record<string, FeatureFlag>;
  isEnabled: (name: string) => boolean;
  setFlag: (name: string, flag: FeatureFlag) => void;
  toggleFlag: (name: string) => void;
  loadFlags: (flags: FeatureFlag[]) => void;
}

export const useFeatureFlags = create<FeatureFlagState>((set, get) => ({
  flags: {
    'novo-dashboard': { name: 'novo-dashboard', enabled: true, description: 'Nova UI do Dashboard' },
    'esocial-v2': { name: 'esocial-v2', enabled: false, description: 'Nova integração eSocial' },
    'relatorios-avancados': { name: 'relatorios-avancados', enabled: true, description: 'Relatórios avançados' },
    'modo-escuro': { name: 'modo-escuro', enabled: true, description: 'Tema escuro' },
    'notificacoes-push': { name: 'notificacoes-push', enabled: false, description: 'Notificações push' },
  },
  isEnabled: (name) => get().flags[name]?.enabled ?? false,
  setFlag: (name, flag) => set((s) => ({ flags: { ...s.flags, [name]: flag } })),
  toggleFlag: (name) => set((s) => ({
    flags: { ...s.flags, [name]: { ...s.flags[name], enabled: !s.flags[name]?.enabled } }
  })),
  loadFlags: (flags) => set({ flags: Object.fromEntries(flags.map(f => [f.name, f])) }),
}));

// HOC para Feature Flag
export function withFeatureFlag<P extends object>(Component: React.ComponentType<P>, flagName: string) {
  return function FeatureFlaggedComponent(props: P) {
    const isEnabled = useFeatureFlags((s) => s.isEnabled(flagName));
    if (!isEnabled) return null;
    return <Component {...props} />;
  };
}

export default useFeatureFlags;
