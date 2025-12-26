import { useCallback } from 'react';
export function useAnalytics() {
  const track = useCallback((event: string, properties?: Record<string, any>) => { console.log('[Analytics]', event, properties); }, []);
  const page = useCallback((name: string) => { console.log('[Analytics] Page:', name); }, []);
  const identify = useCallback((userId: string, traits?: Record<string, any>) => { console.log('[Analytics] Identify:', userId, traits); }, []);
  return { track, page, identify };
}
