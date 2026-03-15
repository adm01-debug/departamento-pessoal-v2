import { supabase } from '@/integrations/supabase/client';

const ensure = <T>(d: T | null, e: string): T => { if (!d) throw new Error(`Nenhum registro de ${e} retornado.`); return d; };

export const catalogoCursoService = {
  async listarCursos(empresaId?: string) {
    let q = supabase.from('catalogo_cursos').select('*').order('nome');
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarCurso(d: any) {
    const { data, error } = await supabase.from('catalogo_cursos').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'curso');
  },
  async atualizarCurso(id: string, d: any) {
    const { data, error } = await supabase.from('catalogo_cursos').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'curso');
  },
  async excluirCurso(id: string) {
    const { error } = await supabase.from('catalogo_cursos').delete().eq('id', id);
    if (error) throw error;
  },
  async listarTrilhas(empresaId?: string) {
    let q = supabase.from('trilhas_aprendizado').select('*').order('nome');
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarTrilha(d: any) {
    const { data, error } = await supabase.from('trilhas_aprendizado').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'trilha');
  },
  async excluirTrilha(id: string) {
    const { error } = await supabase.from('trilhas_aprendizado').delete().eq('id', id);
    if (error) throw error;
  },
  async listarInscricoes(cursoId?: string, empresaId?: string) {
    let q = supabase.from('inscricoes_cursos').select('*, colaborador:colaboradores(nome_completo), curso:catalogo_cursos(nome)').order('created_at', { ascending: false });
    if (cursoId) q = q.eq('curso_id', cursoId);
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarInscricao(d: any) {
    const { data, error } = await supabase.from('inscricoes_cursos').insert(d).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'inscrição');
  },
  async atualizarInscricao(id: string, d: any) {
    const { data, error } = await supabase.from('inscricoes_cursos').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return ensure(data, 'inscrição');
  },
};
