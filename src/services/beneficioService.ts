import { BaseService, ListOptions, ListResponse } from './baseService';
import { auditLogger } from '@/utils/auditLogger';
import { supabase } from '@/integrations/supabase/client';

class BeneficioService extends BaseService<any> {
  constructor() {
    super('beneficios', { 
      defaultOrderBy: 'nome' 
    });
  }

  async listar(options: ListOptions = {}): Promise<ListResponse<any>> {
    const { filters, search } = options;
    const empresaId = (filters as any)?.empresa_id;

    let query = this.getQuery().select('*', { count: 'exact' });
    if (empresaId) query = query.eq('empresa_id', empresaId);
    if (search) query = query.ilike('nome', `%${search}%`);

    const { data, count, error } = await query.order('nome');
    if (error) throw error;
    return { data: data || [], total: count || 0 };
  }

  async listComAdesao(empresaId?: string): Promise<any[]> {
    const { data, error } = await this.getQuery()
      .select('*, beneficios_colaborador(count)')
      .eq('empresa_id', empresaId || '');
    if (error) throw error;
    return data || [];
  }

  async criar(d: any): Promise<any> {
    try {
      const data = await super.criar(d);
      await auditLogger.log({
        tabela: 'beneficios',
        registro_id: data.id,
        acao: 'INSERT',
        dados_novos: data
      });
      return data;
    } catch (e: any) {
      throw new Error(e.message || 'Falha ao criar benefício', { cause: e });
    }
  }

  async atualizar(id: string, d: any): Promise<any> {
    try {
      const anterior = await this.buscarPorId(id);
      const data = await super.atualizar(id, d);
      
      await auditLogger.log({
        tabela: 'beneficios',
        registro_id: id,
        acao: 'UPDATE',
        dados_anteriores: anterior,
        dados_novos: data
      });
      
      return data;
    } catch (e: any) {
      throw new Error(e.message || 'Falha ao atualizar benefício', { cause: e });
    }
  }

  async excluir(id: string): Promise<void> {
    try {
      const anterior = await this.buscarPorId(id);
      await super.excluir(id);
      
      await auditLogger.log({
        tabela: 'beneficios',
        registro_id: id,
        acao: 'DELETE',
        dados_anteriores: anterior
      });
    } catch (e: any) {
      throw new Error(e.message || 'Falha ao excluir benefício', { cause: e });
    }
  }

  async vincularColaborador(beneficioId: string, colaboradorId: string, dados: any): Promise<any> {
    const { data, error } = await (supabase as any).from('beneficios_colaborador').insert({
      beneficio_id: beneficioId,
      colaborador_id: colaboradorId,
      ...dados
    }).select().single();
    if (error) throw error;
    return data;
  }

  async listarPorColaborador(colaboradorId: string): Promise<any[]> {
    const { data, error } = await (supabase as any)
      .from('beneficios_colaborador')
      .select('*, beneficio:beneficios(*)')
      .eq('colaborador_id', colaboradorId);
    if (error) throw error;
    return data || [];
  }

  async obterResumoCustos(empresaId: string): Promise<any> {
    const { data, error } = await (supabase as any)
      .from('beneficios_colaborador')
      .select(`
        id,
        valor_colaborador,
        valor_empresa,
        beneficio:beneficios!inner (
          id,
          nome,
          tipo,
          empresa_id
        )
      `)
      .eq('beneficio.empresa_id', empresaId)
      .eq('status_vinculo', 'ativo');

    if (error) throw error;

    return (data || []).reduce((acc: any, item: any) => {
      const tipo = item.beneficio.tipo || 'Outros';
      if (!acc[tipo]) acc[tipo] = { empresa: 0, colaborador: 0, total: 0 };
      
      const vEmpresa = Number(item.valor_empresa) || 0;
      const vColab = Number(item.valor_colaborador) || 0;
      
      acc[tipo].empresa += vEmpresa;
      acc[tipo].colaborador += vColab;
      acc[tipo].total += (vEmpresa + vColab);
      
      return acc;
    }, {});
  }
}

export const beneficioService = new BeneficioService();
