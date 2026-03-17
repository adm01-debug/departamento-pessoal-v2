import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };

export const batidasPontoService = {
  async listar(colaboradorId: string, dataInicio?: string, dataFim?: string) {
    let q = supabase.from('batidas_ponto').select('*').eq('colaborador_id', colaboradorId).order('data').order('ordem');
    if (dataInicio) q = q.gte('data', dataInicio);
    if (dataFim) q = q.lte('data', dataFim);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async listarPorData(data: string, empresaId?: string) {
    let q = supabase.from('batidas_ponto').select('*, colaborador:colaboradores(nome_completo, foto_url)').eq('data', data).order('ordem');
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data: result, error } = await q;
    if (error) throw error;
    return result || [];
  },
  async registrar(d: any) {
    const { data, error } = await supabase.from('batidas_ponto').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'batida de ponto');
  },
  async ajustar(id: string, d: any) {
    const { data, error } = await supabase.from('batidas_ponto').update({ ...d, ajustado: true }).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'batida de ponto');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('batidas_ponto').delete().eq('id', id);
    if (error) throw error;
  },
};
