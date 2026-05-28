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
    let q = supabase.from('trilhas_aprendizado').select('*').order('titulo');
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

  // === Trilhas ↔ Cursos ===
  async listarTrilhasCursos(trilhaId: string) {
    const { data, error } = await supabase.from('').select('*, curso:catalogo_cursos(id, nome, carga_horaria)').eq('trilha_id', trilhaId).order('ordem');
    if (error) throw error;
    return data || [];
  },
  async vincularCursoTrilha(d: { trilha_id: string; curso_id: string; ordem?: number; obrigatorio?: boolean }) {
    const { data, error } = await supabase.from('').insert(d).select().maybeSingle();
    if (error) throw error;
    return data;
  },
  async desvincularCursoTrilha(id: string) {
    const { error } = await supabase.from('').delete().eq('id', id);
    if (error) throw error;
  },

  // === Instâncias / Turmas ===
  async listarInstancias(cursoId?: string) {
    let q = supabase.from('treinamento_instancias').select('*, curso:catalogo_cursos!treinamento_instancias_curso_id_fkey(nome), instrutor:colaboradores!treinamento_instancias_instrutor_id_fkey(nome_completo)').order('data_inicio', { ascending: true });
    if (cursoId) q = q.eq('curso_id', cursoId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  async criarInstancia(d: any) {
    const { data, error } = await supabase.from('treinamento_instancias').insert(d).select().maybeSingle();
    if (error) throw error;
    return data;
  },
  async atualizarInstancia(id: string, d: any) {
    const { data, error } = await supabase.from('treinamento_instancias').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    return data;
  },

  // === Feedback ===
  async registrarFeedback(d: { inscricao_id: string; nota_satisfacao: number; comentario?: string; aplicabilidade_nota?: number }) {
    const { data, error } = await supabase.from('treinamento_feedback').insert(d).select().maybeSingle();
    if (error) throw error;
    return data;
  },

  // === Certificados ===
  async listarCertificados(colaboradorId?: string, empresaId?: string) {
    let q = supabase.from('').select('*, curso:catalogo_cursos(nome, carga_horaria), colaborador:colaboradores(nome_completo)');
    if (colaboradorId) q = q.eq('colaborador_id', colaboradorId);
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q.order('data_emissao', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  
  async getCertificado(id: string) {
    const { data, error } = await supabase.from('').select('*, curso:catalogo_cursos(*), colaborador:colaboradores(*)').eq('id', id).single();
    if (error) throw error;
    return data;
  }
};
