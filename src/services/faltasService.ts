import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };

export const faltasService = {
  async listar(empresaId?: string) {
    let q = (supabase as any).from('faltas').select('*, colaborador:colaboradores(nome_completo)').order('data', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async buscarPorColaborador(colaboradorId: string) {
    const { data, error } = await (supabase as any).from('faltas').select('*').eq('colaborador_id', colaboradorId).order('data', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async criar(d: any) {
    const { data, error } = await (supabase as any).from('faltas').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'falta');
  },
  async atualizar(id: string, d: any) {
    const { data, error } = await (supabase as any).from('faltas').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'falta');
  },
  async excluir(id: string) {
    const { error } = await (supabase as any).from('faltas').delete().eq('id', id);
    if (error) throw error;
  },
};
