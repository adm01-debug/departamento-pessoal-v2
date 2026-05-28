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

        // 2. Advanced Metrics from Edge Function
        // Only attempt to fetch if user is authenticated (to avoid 401s in header)
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data, error: metricsError } = await supabase.functions.invoke('metricas', {
            body: { empresaId: session.user.id } // Placeholder, usually it's tenant-based
          });

          if (!metricsError && data?.monitoring) {
            setMetrics(data.monitoring);
            
            // Adjust status based on error rate or latency
            if (data.monitoring.success_rate < 90) setStatus('slow');
            else if (duration > 500) setStatus('slow');
            else setStatus('online');
          }
        } else {
          // Unauthenticated fallback
          if (pingError) setStatus('offline');
          else if (duration > 500) setStatus('slow');
          else setStatus('online');
        }

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

