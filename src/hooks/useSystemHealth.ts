import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSystemHealth() {
  const [latency, setLatency] = useState<number | null>(null);
  const [status, setStatus] = useState<'online' | 'slow' | 'offline'>('online');
  const [metrics, setMetrics] = useState<{
    success_rate: number;
    avg_latency: number;
    recent_failures: number;
  } | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      const start = performance.now();
      try {
        // 1. Basic Ping for DB Latency
        const { error: pingError } = await supabase.from('versao_banco').select('versao').limit(1).maybeSingle();
        const end = performance.now();
        const duration = Math.round(end - start);

        setLatency(duration);

        // 2. Status determination
        // P3-temp: chamada à edge function `metricas` desabilitada — ela exige
        // tenant correto e CSRF em Origin. O ping acima já valida a saúde básica.
        if (pingError) setStatus('offline');
        else if (duration > 500) setStatus('slow');
        else setStatus('online');
      } catch (e) {
        setStatus('offline');
        setLatency(null);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute to keep 10/10 performance
    return () => clearInterval(interval);
  }, []);

  return { latency, status, metrics };
}

