import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };

export const controleAcessoService = {
  async listar(empresaId?: string) {
    let q = supabase.from('controle_acesso').select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async registrar(d: any) {
    const { data, error } = await supabase.from('controle_acesso').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'registro de acesso');
  },
  async excluir(id: string) {
    const { error } = await supabase.from('controle_acesso').delete().eq('id', id);
    if (error) throw error;
  },
};
