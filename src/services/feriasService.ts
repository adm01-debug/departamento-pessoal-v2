import { BaseService } from './baseService';
import { Ferias } from '@/types/entities';
import { supabase } from '@/integrations/supabase/client';

class FeriasService extends BaseService<Ferias> {
  constructor() {
    super('ferias', { 
      searchColumn: 'colaborador_nome', 
      defaultOrderBy: 'data_inicio' 
    });
  }

  async listSolicitacoes(empresaId?: string, params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<{ data: Ferias[]; count: number }> {
    const { page = 1, limit = 10, search, status } = params || {};
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = this.getQuery()
      .select('*, colaborador:colaboradores(nome_completo, avatar_url)', { count: 'exact' });

    if (empresaId) query = query.eq('empresa_id', empresaId);
    if (status && status !== 'all') query = query.eq('status', status);
    
    if (search && search.length >= 3) {
      query = query.ilike('colaborador_nome', `%${search}%`);
    }

    const { data, error, count } = await query
      .order('data_inicio', { ascending: false })
      .range(from, to);
      
    if (error) throw error;
    return { data: (data as any[]) || [], count: count || 0 };
  }

  // Backward compatibility alias
  async listar(empresaId?: string) {
    return this.listSolicitacoes(empresaId);
  }

  async aprovar(id: string): Promise<void> {
    const { error } = await this.getQuery().update({ status: 'aprovada' } as any).eq('id', id);
    if (error) throw error;
  }

  async aprovarGestor(id: string, userId?: string): Promise<void> {
    const { error } = await this.getQuery().update({
      status_aprovacao_gestor: 'aprovado',
      aprovado_gestor: true,
      aprovado_gestor_em: new Date().toISOString(),
      aprovado_gestor_por: userId || null,
    } as any).eq('id', id);
    if (error) throw error;
  }

  async aprovarRH(id: string, userId?: string): Promise<void> {
    const { error } = await this.getQuery().update({
      status_aprovacao_rh: 'aprovado',
      aprovado_rh: true,
      aprovado_rh_em: new Date().toISOString(),
      aprovado_rh_por: userId || null,
      status: 'aprovada',
    } as any).eq('id', id);
    if (error) throw error;
  }

  async listPeriodosAquisitivos(colaboradorId: string): Promise<any[]> {
    const { data, error } = await (supabase as any)
      .from('periodos_aquisitivos')
      .select('*')
      .eq('colaborador_id', colaboradorId)
      .order('data_inicio', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async rejeitar(id: string): Promise<void> {
    const { error } = await this.getQuery().update({ status: 'rejeitada' } as any).eq('id', id);
    if (error) throw error;
  }

  async cancelar(id: string, userId?: string): Promise<void> {
    const { error } = await this.getQuery().update({
      cancelado: true,
      cancelado_em: new Date().toISOString(),
      cancelado_por: userId || null,
      status: 'cancelada',
    } as any).eq('id', id);
    if (error) throw error;
  }
}

export const feriasService = new FeriasService();
