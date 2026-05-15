import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '@/utils/auditLogger';
export const beneficioService = {
  async list(empresaId?: string): Promise<any[]> {
    
    let query = supabase.from('beneficios').select('*').order('nome');
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  
  },
  
  async listComAdesao(empresaId?: string): Promise<any[]> {
    
    const { data, error } = await supabase
      .from('beneficios')
      .select('*, beneficios_colaborador(count)')
      .eq('empresa_id', empresaId || '');
    if (error) throw error;
    return data || [];
  
  },

  async criar(d: any): Promise<any> {
    try {
      const { data, error } = await supabase.from('beneficios').insert(d).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de benefício foi retornado.');
      
      await auditLogger.log({
        tabela: 'beneficios',
        registro_id: data.id,
        acao: 'INSERT',
        dados_novos: data
      });
      
      return (data);
    } catch (e: any) {
      throw new Error(e.message || 'Falha ao criar benefício');
    }
  },

  async atualizar(id: string, d: any): Promise<any> {
    try {
      const { data: anterior } = await supabase.from('beneficios').select('*').eq('id', id).single();
      const { data, error } = await supabase.from('beneficios').update(d).eq('id', id).select().maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Nenhum registro de benefício foi retornado.');
      
      await auditLogger.log({
        tabela: 'beneficios',
        registro_id: id,
        acao: 'UPDATE',
        dados_anteriores: anterior,
        dados_novos: data
      });
      
      return (data);
    } catch (e: any) {
      throw new Error(e.message || 'Falha ao atualizar benefício');
    }
  },

  async excluir(id: string): Promise<void> {
    try {
      const { data: anterior } = await supabase.from('beneficios').select('*').eq('id', id).single();
      const { error } = await supabase.from('beneficios').delete().eq('id', id);
      if (error) throw error;
      
      await auditLogger.log({
        tabela: 'beneficios',
        registro_id: id,
        acao: 'DELETE',
        dados_anteriores: anterior
      });
      return (undefined);
    } catch (e: any) {
      throw new Error(e.message || 'Falha ao excluir benefício');
    }
  },

  async vincularColaborador(beneficioId: string, colaboradorId: string, dados: any): Promise<any> {
    
    const { data, error } = await supabase.from('beneficios_colaborador').insert({
      beneficio_id: beneficioId,
      colaborador_id: colaboradorId,
      ...dados
    }).select().single();
    if (error) throw error;
    return data;
  
  },

  async listarPorColaborador(colaboradorId: string): Promise<any[]> {
    
    const { data, error } = await supabase
      .from('beneficios_colaborador')
      .select('*, beneficio:beneficios(*)')
      .eq('colaborador_id', colaboradorId);
    if (error) throw error;
    return data || [];
  
  },

  async obterResumoCustos(empresaId: string): Promise<any> {
    
    const { data, error } = await supabase
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
};

