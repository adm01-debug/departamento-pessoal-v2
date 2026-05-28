import { supabase } from '@/integrations/supabase/client';
export const recrutamentoService = {
  // ===== VAGAS =====
  async listarVagas(empresaId?: string): Promise<any[]> {
    
    let q = supabase.from('vagas').select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  
  },

  async criarVaga(d: Record<string, unknown>): Promise<unknown> {
    
    const { data, error } = await supabase.from('vagas').insert(d as Record<string, unknown>).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de vaga foi retornado.');
    return data;
  
  },

  async atualizarVaga(id: string, d: Record<string, unknown>): Promise<unknown> {
    
    const { data, error } = await supabase.from('vagas').update(d as Record<string, unknown>).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de vaga foi retornado.');
    return data;
  
  },

  async excluirVaga(id: string): Promise<void> {
    
    const { error } = await supabase.from('vagas').delete().eq('id', id);
    if (error) throw error;
  
  },

  // ===== CANDIDATOS =====
  async listarCandidatos(empresaId?: string): Promise<any[]> {
    
    let q = supabase.from('candidatos').select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  
  },

  async criarCandidato(d: Record<string, unknown>): Promise<unknown> {
    
    const { data, error } = await supabase.from('candidatos').insert(d as Record<string, unknown>).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de candidato foi retornado.');
    return data;
  
  },

  async atualizarCandidato(id: string, d: Record<string, unknown>): Promise<unknown> {
    
    const { data, error } = await supabase.from('candidatos').update(d as Record<string, unknown>).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de candidato foi retornado.');
    return data;
  
  },

  async excluirCandidato(id: string): Promise<void> {
    
    const { error } = await supabase.from('candidatos').delete().eq('id', id);
    if (error) throw error;
  
  },

  // ===== CANDIDATURAS =====
  async listarCandidaturas(vagaId?: string): Promise<any[]> {
    
    let q = supabase.from('candidaturas').select('*, candidato:candidatos(*), vaga:vagas(titulo, departamento)').order('created_at', { ascending: false });
    if (vagaId) q = q.eq('vaga_id', vagaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  
  },

  async criarCandidatura(d: Record<string, unknown>): Promise<unknown> {
    
    const { data, error } = await supabase.from('candidaturas').insert(d as Record<string, unknown>).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de candidatura foi retornado.');
    return data;
  
  },

  async atualizarCandidatura(id: string, d: Record<string, unknown>): Promise<unknown> {
    
    const { data, error } = await supabase.from('candidaturas').update(d as Record<string, unknown>).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de candidatura foi retornado.');
    return data;
  
  },

  async excluirCandidatura(id: string): Promise<void> {
    
    const { error } = await supabase.from('candidaturas').delete().eq('id', id);
    if (error) throw error;
  
  },

  // ===== TESTES E ENTREVISTAS =====
  async agendarEntrevista(d: Record<string, unknown>): Promise<unknown> {
    
    const { data, error } = await supabase.from('recrutamento_entrevistas').insert(d as Record<string, unknown>).select().maybeSingle();
    if (error) throw error;
    return data;
  
  },

  async registrarTeste(d: Record<string, unknown>): Promise<unknown> {
    
    const { data, error } = await supabase.from('recrutamento_testes').insert(d as Record<string, unknown>).select().maybeSingle();
    if (error) throw error;
    return data;
  
  },

  async adicionarAnotacao(d: Record<string, unknown>): Promise<unknown> {
    
    const { data, error } = await supabase.from('recrutamento_anotacoes').insert(d as Record<string, unknown>).select().maybeSingle();
    if (error) throw error;
    return data;
  
  },
};

