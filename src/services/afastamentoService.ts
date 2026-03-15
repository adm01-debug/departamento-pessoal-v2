import { supabase } from '@/integrations/supabase/client';

const ensureSingleResult = <T>(data: T | null, entity: string): T => {
  if (!data) throw new Error(`Nenhum registro de ${entity} foi retornado.`);
  return data;
};

export const afastamentoService = {
  async listar(empresaId?: string) {
    let query = supabase.from('afastamentos').select('*, colaborador:colaboradores(nome_completo)').order('data_inicio', { ascending: false });
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  async buscarPorId(id: string) {
    const { data, error } = await supabase.from('afastamentos').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async buscarPorColaborador(colaboradorId: string) {
    const { data, error } = await supabase.from('afastamentos').select('*').eq('colaborador_id', colaboradorId).order('data_inicio', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async criar(d: any) {
    const { data, error } = await supabase.from('afastamentos').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'afastamento');
  },
  async atualizar(id: string, d: any) {
    const { data, error } = await supabase.from('afastamentos').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensureSingleResult(data, 'afastamento');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('afastamentos').delete().eq('id', id);
    if (error) throw error;
  },
  calcularDias(inicio: string, fim: string): number {
    const diffMs = new Date(fim).getTime() - new Date(inicio).getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
  },
};
