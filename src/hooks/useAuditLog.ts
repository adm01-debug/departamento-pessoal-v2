/**
 * @fileoverview Hook para log de auditoria
 * @module hooks/useAuditLog
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLogEntry {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export function useAuditLog(entityType?: string, entityId?: string) {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['auditLogs', entityType, entityId],
    queryFn: async () => {
      let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      if (entityType) query = query.eq('entity_type', entityType);
      if (entityId) query = query.eq('entity_id', entityId);
      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data as AuditLogEntry[];
    },
  });

  const logMutation = useMutation({
    mutationFn: async (entry: Omit<AuditLogEntry, 'id' | 'created_at'>) => {
      const { error } = await supabase.from('audit_logs').insert(entry);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auditLogs'] }),
  });

  return {
    logs,
    isLoading,
    log: logMutation.mutateAsync,
  };
}

export default useAuditLog;
