import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient, QueryKey } from '@tanstack/react-query';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export function useRealTimeSubscription(
  table: string,
  queryKey: QueryKey,
  empresaId?: string,
  options: { event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'; schema?: string } = { event: '*', schema: 'public' }
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!empresaId) return;

    const channel = supabase
      .channel(`rt-${table}-${empresaId}`)
      .on(
        'postgres_changes',
        {
          event: options.event || '*',
          schema: options.schema || 'public',
          table: table,
          filter: `empresa_id=eq.${empresaId}`,
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          // Log only in dev mode
          if (import.meta.env.DEV) {
            console.debug(`[RealTime] Change detected in ${table}:`, payload.eventType);
          }
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, queryKey, empresaId, options.event, options.schema, queryClient]);
}
