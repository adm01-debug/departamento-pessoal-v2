import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };

export const medidasDisciplinaresService = {
  async listar(empresaId?: string) {
    let q = supabase.from('medidas_disciplinares').select('*, colaborador:colaboradores(nome_completo)').order('data_ocorrencia', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async buscarPorColaborador(colaboradorId: string) {
    const { data, error } = await supabase.from('medidas_disciplinares').select('*').eq('colaborador_id', colaboradorId).order('data_ocorrencia', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async criar(d: any) {
    const { data, error } = await supabase.from('medidas_disciplinares').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'medida disciplinar');
  },
  async atualizar(id: string, d: any) {
    const { data, error } = await supabase.from('medidas_disciplinares').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'medida disciplinar');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('medidas_disciplinares').delete().eq('id', id);
    if (error) throw error;
  },
};
