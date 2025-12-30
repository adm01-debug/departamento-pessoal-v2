/**
 * @fileoverview Hook para feature flags
 * @module hooks/useFeatureFlag
 */
import { useMemo } from 'react';

const DEFAULT_FLAGS: Record<string, boolean> = {
  'new-dashboard': true,
  'esocial-integration': true,
  'dark-mode': true,
  'ai-assistant': false,
  'beta-features': false,
};

export function useFeatureFlag(flag: string): boolean {
  return useMemo(() => {
    // Verificar localStorage para overrides
    const override = localStorage.getItem(`ff_${flag}`);
    if (override !== null) return override === 'true';
    
    // Usar valor padrão
    return DEFAULT_FLAGS[flag] ?? false;
  }, [flag]);
}

export function useFeatureFlags() {
  const isEnabled = (flag: string) => {
    const override = localStorage.getItem(`ff_${flag}`);
    if (override !== null) return override === 'true';
    return DEFAULT_FLAGS[flag] ?? false;
  };

  const setFlag = (flag: string, enabled: boolean) => {
    localStorage.setItem(`ff_${flag}`, String(enabled));
  };

  return { isEnabled, setFlag, flags: DEFAULT_FLAGS };
}

export default useFeatureFlag;
