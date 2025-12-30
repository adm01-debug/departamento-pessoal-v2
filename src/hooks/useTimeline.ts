/**
 * @fileoverview Hook para timeline
 * @module hooks/useTimeline
 */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TimelineEvent {
  id: string;
  tipo: string;
  titulo: string;
  descricao?: string;
  data: string;
  usuario?: string;
}

export function useTimeline(entityType?: string, entityId?: string) {
  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ['timeline', entityType, entityId],
    queryFn: async () => {
      let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50);
      if (entityType) query = query.eq('entity_type', entityType);
      if (entityId) query = query.eq('entity_id', entityId);
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(log => ({
        id: log.id,
        tipo: log.action,
        titulo: log.action,
        descricao: JSON.stringify(log.new_values),
        data: log.created_at,
        usuario: log.user_id,
      })) as TimelineEvent[];
    },
  });

  return { eventos, isLoading };
}

export default useTimeline;
