/**
 * @fileoverview Hook para analytics
 * @module hooks/useAnalytics
 */
import { useCallback } from 'react';

export function useAnalytics() {
  const track = useCallback((event: string, properties?: Record<string, any>) => {
    console.log('[Analytics]', event, properties);
    // Integração com serviço de analytics aqui
  }, []);

  const page = useCallback((name: string, properties?: Record<string, any>) => {
    console.log('[Analytics] Page:', name, properties);
  }, []);

  const identify = useCallback((userId: string, traits?: Record<string, any>) => {
    console.log('[Analytics] Identify:', userId, traits);
  }, []);

  return { track, page, identify };
}

export default useAnalytics;
