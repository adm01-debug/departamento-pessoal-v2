import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSystemHealth() {
  const [latency, setLatency] = useState<number | null>(null);
  const [status, setStatus] = useState<'online' | 'slow' | 'offline'>('online');

  useEffect(() => {
    const checkHealth = async () => {
      const start = performance.now();
      try {
        // Ping a very small table or just a simple RPC/select
        const { error } = await supabase.from('empresas').select('id').limit(1);
        const end = performance.now();
        const duration = Math.round(end - start);
        
        setLatency(duration);
        if (error) setStatus('offline');
        else if (duration > 500) setStatus('slow');
        else setStatus('online');
      } catch (e) {
        setStatus('offline');
        setLatency(null);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return { latency, status };
}
