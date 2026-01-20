// V19-025: Audit Log Service
import { supabase } from '@/integrations/supabase/client';

export type AuditAction = 'create' | 'update' | 'delete' | 'view' | 'export' | 'login' | 'logout';
export type AuditEntity = 'colaborador' | 'folha' | 'ferias' | 'ponto' | 'esocial' | 'usuario' | 'empresa';

export interface AuditLog {
  id?: string;
  user_id: string;
  user_email?: string;
  action: AuditAction;
  entity: AuditEntity;
  entity_id?: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export const auditLogService = {
  async log(log: Omit<AuditLog, 'id' | 'created_at'>): Promise<void> {
    try {
      await supabase.from('audit_logs').insert({
        ...log,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('[AuditLog] Error:', error);
    }
  },

  async logCreate(userId: string, entity: AuditEntity, entityId: string, newValues: Record<string, unknown>) {
    await this.log({ user_id: userId, action: 'create', entity, entity_id: entityId, new_values: newValues });
  },

  async logUpdate(userId: string, entity: AuditEntity, entityId: string, oldValues: Record<string, unknown>, newValues: Record<string, unknown>) {
    await this.log({ user_id: userId, action: 'update', entity, entity_id: entityId, old_values: oldValues, new_values: newValues });
  },

  async logDelete(userId: string, entity: AuditEntity, entityId: string, oldValues: Record<string, unknown>) {
    await this.log({ user_id: userId, action: 'delete', entity, entity_id: entityId, old_values: oldValues });
  },

  async getLogs(filters?: { entity?: AuditEntity; user_id?: string; from?: string; to?: string }): Promise<AuditLog[]> {
    let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
    if (filters?.entity) query = query.eq('entity', filters.entity);
    if (filters?.user_id) query = query.eq('user_id', filters.user_id);
    if (filters?.from) query = query.gte('created_at', filters.from);
    if (filters?.to) query = query.lte('created_at', filters.to);
    const { data } = await query;
    return data || [];
  },
};

export default auditLogService;
