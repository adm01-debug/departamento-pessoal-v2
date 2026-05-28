import { supabase } from '@/integrations/supabase/client';

export const configAfastamentosService = {
  obter: async (empresaId: string) => {
    const { data, error } = await supabase.from('').select('*').eq('empresa_id', empresaId).maybeSingle();
    if (error) throw error;
    return data;
  },
  salvar: async (d: any) => {
    const { error } = await supabase.from('').upsert(d, { onConflict: 'empresa_id' });
    if (error) throw error;
  },
};

export const feriasSolicitacoesService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('').select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('').insert(d);
    if (error) throw error;
  },
  atualizar: async (id: string, d: any) => {
    const { error } = await supabase.from('').update(d).eq('id', id);
    if (error) throw error;
  },
};

export const historicoCargoService = {
  listar: async (colaboradorId: string) => {
    const { data, error } = await supabase.from('').select('*').eq('colaborador_id', colaboradorId).order('data_inicio', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};

export const historicoFeriasService = {
  listar: async (colaboradorId: string) => {
    const { data, error } = await supabase.from('').select('*').eq('colaborador_id', colaboradorId).order('data_inicio', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};

export const linhasTransporteService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('').select('*').order('nome');
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('').insert(d);
    if (error) throw error;
  },
};

export const notificacoesAdmissaoService = {
  listar: async (admissaoId: string) => {
    const { data, error } = await supabase.from('').select('*').eq('admissao_id', admissaoId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};

export const onboardingService = {
  listarTemplates: async (empresaId?: string) => {
    let q = supabase.from('').select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criarTemplate: async (d: any) => {
    const { data, error } = await supabase.from('').insert(d).select().maybeSingle();
    if (error) throw error;
    return data;
  },
  listarTemplateTarefas: async (templateId: string) => {
    const { data, error } = await supabase.from('').select('*').eq('template_id', templateId).order('ordem');
    if (error) throw error;
    return data || [];
  },
  criarTemplateTarefa: async (d: any) => {
    const { error } = await supabase.from('').insert(d);
    if (error) throw error;
  },
  listarColaboradores: async (empresaId?: string) => {
    let q = supabase.from('').select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  iniciarOnboarding: async (d: any) => {
    const { data, error } = await supabase.from('').insert(d).select().maybeSingle();
    if (error) throw error;
    return data;
  },
  listarTarefas: async (onboardingId: string) => {
    const { data, error } = await supabase.from('').select('*').eq('onboarding_id', onboardingId).order('ordem');
    if (error) throw error;
    return data || [];
  },
  concluirTarefa: async (id: string) => {
    const { error } = await supabase.from('').update({ concluida: true, concluida_em: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
  },
};

export const treinamentoParticipantesService = {
  listar: async (inscricaoId?: string) => {
    let q = supabase.from('').select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (inscricaoId) q = q.eq('inscricao_id', inscricaoId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  registrarPresenca: async (id: string) => {
    const { error } = await supabase.from('').update({ presente: true }).eq('id', id);
    if (error) throw error;
  },
};
