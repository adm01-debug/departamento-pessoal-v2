import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export function useRealTimeSubscription(
  table: string,
  queryKey: any[],
  empresaId?: string,
  options: { event?: string; schema?: string } = { event: '*', schema: 'public' }
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!empresaId) return;

    const channel = supabase
      .channel(`rt-${table}-${empresaId}`)
      .on(
        'postgres_changes' as any,
        {
          event: options.event as any,
          schema: options.schema || 'public',
          table: table,
          filter: `empresa_id=eq.${empresaId}`,
        },
        (payload: any) => {
          console.log(`Real-time change in ${table}:`, payload);
          queryClient.invalidateQueries({ queryKey });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, queryKey, empresaId, options.event, options.schema, queryClient]);
}
