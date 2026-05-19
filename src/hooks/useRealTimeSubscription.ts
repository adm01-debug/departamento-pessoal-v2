import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient, QueryKey } from '@tanstack/react-query';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { loggerService } from '@/services/loggerService';

export function useRealTimeSubscription(
  table: string,
  queryKey: QueryKey,
  empresaId?: string,
  options: { event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'; schema?: string } = { event: '*', schema: 'public' }
) {
  const queryClient = useQueryClient();

  const handleChange = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    if (import.meta.env.DEV) {
      console.debug(`[RealTime] Change detected in ${table}:`, payload.eventType);
    }
    loggerService.info(`Realtime change detected in ${table}`, { 
      table, 
      eventType: payload.eventType,
      schema: payload.schema 
    });
    void queryClient.invalidateQueries({ queryKey });
  }, [table, queryClient, queryKey]);

  useEffect(() => {
    if (!empresaId) return;

    const channelName = `rt-${table}-${empresaId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes' as any,
        {
          event: options.event || '*',
          schema: options.schema || 'public',
          table: table,
          filter: `empresa_id=eq.${empresaId}`,
        } as any,
        handleChange
      );

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        loggerService.info(`Subscribed to realtime channel: ${channelName}`);
      } else if (status === 'CHANNEL_ERROR') {
        loggerService.error(`Failed to subscribe to realtime channel: ${channelName}`);
      }
    });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [table, queryKey, empresaId, options.event, options.schema, handleChange]);
}
