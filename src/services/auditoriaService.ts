// V15-396
import { supabase } from '@/integrations/supabase/client';
export interface LogAuditoria { id: string; usuario_id: string; usuario_email?: string; acao: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW'; entidade: string; entidade_id?: string; dados_anteriores?: any; dados_novos?: any; ip?: string; created_at: string; }
export const auditoriaService = {
  async list(filters?: { entidade?: string; acao?: string; dataInicio?: string; dataFim?: string }) { let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100); if (filters?.entidade) query = query.eq('entidade', filters.entidade); if (filters?.acao) query = query.eq('acao', filters.acao); if (filters?.dataInicio) query = query.gte('created_at', filters.dataInicio); if (filters?.dataFim) query = query.lte('created_at', filters.dataFim); const { data, error } = await query; if (error) throw error; return data as LogAuditoria[]; },
  async registrar(log: Omit<LogAuditoria, 'id' | 'created_at'>) { const { error } = await supabase.from('audit_logs').insert(log); if (error) console.error('Erro ao registrar auditoria:', error); },
};
