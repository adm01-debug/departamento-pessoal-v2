import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
export function useAuditLog() {
  const log = useCallback(async (action: string, entity: string, entityId: string, details?: any) => { await supabase.from('audit_logs').insert({ action, entity, entity_id: entityId, details, timestamp: new Date().toISOString() }); }, []);
  return { log };
}
