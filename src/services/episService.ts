import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };

export const episService = {
  async listar(empresaId?: string) {
    let q = supabase.from('epis').select('*').order('nome');
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criar(d: any) {
    const { data, error } = await supabase.from('epis').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'EPI');
  },
  async atualizar(id: string, d: any) {
    const { data, error } = await supabase.from('epis').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'EPI');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('epis').delete().eq('id', id);
    if (error) throw error;
  },
};

export const episEntregasService = {
  async listar(empresaId?: string) {
    let q = supabase.from('epis_entregas').select('*, epi:epis(nome, ca), colaborador:colaboradores(nome_completo)').order('data_entrega', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async buscarPorColaborador(colaboradorId: string) {
    const { data, error } = await supabase.from('epis_entregas').select('*, epi:epis(nome, ca)').eq('colaborador_id', colaboradorId).order('data_entrega', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async criar(d: any) {
    const { data, error } = await supabase.from('epis_entregas').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'entrega de EPI');
  },
  async registrarDevolucao(id: string, dataDevolucao: string) {
    const { data, error } = await supabase.from('epis_entregas').update({ data_devolucao: dataDevolucao }).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'devolução de EPI');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('epis_entregas').delete().eq('id', id);
    if (error) throw error;
  },
};
