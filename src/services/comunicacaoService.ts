import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };

export const comunicacaoService = {
  async listarComunicados(empresaId?: string) {
    let q = supabase.from('comunicados').select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarComunicado(d: any) {
    const { data, error } = await supabase.from('comunicados').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'comunicado');
  },
  async atualizarComunicado(id: string, d: any) {
    const { data, error } = await supabase.from('comunicados').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'comunicado');
  },
  async excluirComunicado(id: string) {
    const { error } = await supabase.from('comunicados').delete().eq('id', id);
    if (error) throw error;
  },
  async marcarLido(comunicadoId: string, usuarioId: string) {
    const { data, error } = await supabase.from('comunicados_leituras').insert({ comunicado_id: comunicadoId, usuario_id: usuarioId }).select().maybeSingle();
    if (error) throw error;
    return data;
  },
  async listarDenuncias(empresaId?: string) {
    let q = supabase.from('canal_etica').select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarDenuncia(d: any) {
    const { data, error } = await supabase.from('canal_etica').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'denúncia');
  },
  async atualizarDenuncia(id: string, d: any) {
    const { data, error } = await supabase.from('canal_etica').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'denúncia');
  },
};
