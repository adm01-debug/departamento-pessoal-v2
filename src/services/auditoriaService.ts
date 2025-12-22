import { supabase } from '@/integrations/supabase/client';
import { AuditLog, AuditFilters, AuditStats } from '@/types/auditoria';

export const auditoriaService = {
  async registrar(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({ ...log, timestamp: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async listar(filters?: AuditFilters): Promise<AuditLog[]> {
    let query = supabase.from('audit_logs').select('*');
    
    if (filters?.usuario_id) query = query.eq('usuario_id', filters.usuario_id);
    if (filters?.acao) query = query.eq('acao', filters.acao);
    if (filters?.entidade) query = query.eq('entidade', filters.entidade);
    if (filters?.data_inicio) query = query.gte('timestamp', filters.data_inicio);
    if (filters?.data_fim) query = query.lte('timestamp', filters.data_fim);
    
    const { data, error } = await query.order('timestamp', { ascending: false }).limit(1000);
    if (error) throw error;
    return data ?? [];
  },

  async obterEstatisticas(empresa_id?: string): Promise<AuditStats> {
    const logs = await this.listar(empresa_id ? { empresa_id } : undefined);
    
    return {
      total_acoes: logs.length,
      por_acao: logs.reduce((acc, l) => ({ ...acc, [l.acao]: (acc[l.acao] ?? 0) + 1 }), {} as Record<string, number>),
      por_usuario: logs.reduce((acc, l) => ({ ...acc, [l.usuario_id]: (acc[l.usuario_id] ?? 0) + 1 }), {} as Record<string, number>),
      por_entidade: logs.reduce((acc, l) => ({ ...acc, [l.entidade]: (acc[l.entidade] ?? 0) + 1 }), {} as Record<string, number>),
    };
  },

  async limparAntigos(diasRetencao: number = 90): Promise<number> {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - diasRetencao);
    
    const { data, error } = await supabase
      .from('audit_logs')
      .delete()
      .lt('timestamp', dataLimite.toISOString())
      .select('id');
    
    if (error) throw error;
    return data?.length ?? 0;
  },
};

export default auditoriaService;
