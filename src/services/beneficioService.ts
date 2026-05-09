import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '@/utils/auditLogger';

const ensureSingleResult = <T>(data: T | null, entity: string): T => {
  if (!data) throw new Error(`Nenhum registro de ${entity} foi retornado pela operação.`);
  return data;
};

export const beneficioService = {
  async list(empresaId?: string) {
    let query = supabase.from('beneficios').select('*').order('nome');
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  
  async listComAdesao(empresaId?: string) {
    const { data, error } = await supabase
      .from('beneficios')
      .select('*, beneficios_colaborador(count)')
      .eq('empresa_id', empresaId || '');
    if (error) throw error;
    return data || [];
  },

  async criar(d: any) {
    const { data, error } = await supabase.from('beneficios').insert(d).select().maybeSingle();
    if (error) throw error;
    
    if (data) {
      await auditLogger.log({
        tabela: 'beneficios',
        registro_id: data.id,
        acao: 'INSERT',
        dados_novos: data
      });
    }
    
    return ensureSingleResult(data, 'benefício');
  },

  async atualizar(id: string, d: any) {
    const { data: anterior } = await supabase.from('beneficios').select('*').eq('id', id).single();
    const { data, error } = await supabase.from('beneficios').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    
    if (data) {
      await auditLogger.log({
        tabela: 'beneficios',
        registro_id: id,
        acao: 'UPDATE',
        dados_anteriores: anterior,
        dados_novos: data
      });
    }
    
    return ensureSingleResult(data, 'benefício');
  },

  async excluir(id: string) {
    const { data: anterior } = await supabase.from('beneficios').select('*').eq('id', id).single();
    const { error } = await supabase.from('beneficios').delete().eq('id', id);
    if (error) throw error;
    
    await auditLogger.log({
      tabela: 'beneficios',
      registro_id: id,
      acao: 'DELETE',
      dados_anteriores: anterior
    });
  },

  async vincularColaborador(beneficioId: string, colaboradorId: string, dados: any) {
    const { data, error } = await supabase.from('beneficios_colaborador').insert({
      beneficio_id: beneficioId,
      colaborador_id: colaboradorId,
      ...dados
    }).select().single();
    if (error) throw error;
    return data;
  },

  async listarPorColaborador(colaboradorId: string) {
    const { data, error } = await supabase
      .from('beneficios_colaborador')
      .select('*, beneficio:beneficios(*)')
      .eq('colaborador_id', colaboradorId);
    if (error) throw error;
    return data || [];
  }
};
