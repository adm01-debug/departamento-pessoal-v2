// V18: AuditService - Log de auditoria
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  acao: string;
  entidade: string;
  entidade_id: string;
  usuario_id: string;
  usuario_nome?: string;
  dados_anteriores?: any;
  dados_novos?: any;
  ip?: string;
  created_at: string;
}

export interface AuditFilters {
  entidade?: string;
  usuario_id?: string;
  data_inicio?: string;
  data_fim?: string;
  page?: number;
  limit?: number;
}

export const auditServiceReal = {
  async listar(filters: AuditFilters = {}): Promise<AuditLog[]> {
    let query = supabase
      .from('audit_logs')
      .select('*, usuario:usuarios(nome)')
      .order('created_at', { ascending: false });

    if (filters.entidade) query = query.eq('entidade', filters.entidade);
    if (filters.usuario_id) query = query.eq('usuario_id', filters.usuario_id);
    if (filters.data_inicio) query = query.gte('created_at', filters.data_inicio);
    if (filters.data_fim) query = query.lte('created_at', filters.data_fim);
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async buscar(id: string): Promise<AuditLog | null> {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*, usuario:usuarios(nome)')
      .eq('id', id)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async registrar(log: {
    acao: string;
    entidade: string;
    entidade_id: string;
    dados_anteriores?: any;
    dados_novos?: any;
  }): Promise<AuditLog> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        ...log,
        usuario_id: user?.id,
      })
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async exportar(filters: AuditFilters): Promise<Blob> {
    const logs = await this.listar(filters);
    const csv = [
      'Data,Ação,Entidade,Usuário',
      ...logs.map(l => 
        `${l.created_at},${l.acao},${l.entidade},${l.usuario_nome || l.usuario_id}`
      )
    ].join('\n');
    return new Blob([csv], { type: 'text/csv' });
  },
};

export default auditServiceReal;
