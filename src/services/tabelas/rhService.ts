import { supabase } from '@/integrations/supabase/client';

export const configAfastamentosService = {
  obter: async (empresaId: string) => {
    const { data, error } = await supabase.from('config_afastamentos' as any).select('*').eq('empresa_id', empresaId).maybeSingle();
    if (error) throw error;
    return data;
  },
  salvar: async (d: any) => {
    const { error } = await supabase.from('config_afastamentos' as any).upsert(d, { onConflict: 'empresa_id' });
    if (error) throw error;
  },
};

export const feriasSolicitacoesService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('ferias_solicitacoes' as any).select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('ferias_solicitacoes' as any).insert(d);
    if (error) throw error;
  },
  atualizar: async (id: string, d: any) => {
    const { error } = await supabase.from('ferias_solicitacoes' as any).update(d).eq('id', id);
    if (error) throw error;
  },
};

export const historicoCargoService = {
  listar: async (colaboradorId: string) => {
    const { data, error } = await supabase.from('historico_cargo' as any).select('*').eq('colaborador_id', colaboradorId).order('data_inicio', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};

export const historicoFeriasService = {
  listar: async (colaboradorId: string) => {
    const { data, error } = await supabase.from('historico_ferias' as any).select('*').eq('colaborador_id', colaboradorId).order('data_inicio', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};

export const linhasTransporteService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('linhas_transporte' as any).select('*').order('nome');
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('linhas_transporte' as any).insert(d);
    if (error) throw error;
  },
};

export const notificacoesAdmissaoService = {
  listar: async (admissaoId: string) => {
    const { data, error } = await supabase.from('notificacoes_admissao' as any).select('*').eq('admissao_id', admissaoId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};

export const onboardingService = {
  listarTemplates: async (empresaId?: string) => {
    let q = supabase.from('onboarding_templates' as any).select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criarTemplate: async (d: any) => {
    const { data, error } = await supabase.from('onboarding_templates' as any).insert(d).select().maybeSingle();
    if (error) throw error;
    return data;
  },
  listarTemplateTarefas: async (templateId: string) => {
    const { data, error } = await supabase.from('onboarding_template_tarefas' as any).select('*').eq('template_id', templateId).order('ordem');
    if (error) throw error;
    return data || [];
  },
  criarTemplateTarefa: async (d: any) => {
    const { error } = await supabase.from('onboarding_template_tarefas' as any).insert(d);
    if (error) throw error;
  },
  listarColaboradores: async (empresaId?: string) => {
    let q = supabase.from('onboarding_colaborador' as any).select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  iniciarOnboarding: async (d: any) => {
    const { data, error } = await supabase.from('onboarding_colaborador' as any).insert(d).select().maybeSingle();
    if (error) throw error;
    return data;
  },
  listarTarefas: async (onboardingId: string) => {
    const { data, error } = await supabase.from('onboarding_tarefas' as any).select('*').eq('onboarding_id', onboardingId).order('ordem');
    if (error) throw error;
    return data || [];
  },
  concluirTarefa: async (id: string) => {
    const { error } = await supabase.from('onboarding_tarefas' as any).update({ concluida: true, concluida_em: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
  },
};

export const treinamentoParticipantesService = {
  listar: async (inscricaoId?: string) => {
    let q = supabase.from('treinamento_participantes' as any).select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (inscricaoId) q = q.eq('inscricao_id', inscricaoId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  registrarPresenca: async (id: string) => {
    const { error } = await supabase.from('treinamento_participantes' as any).update({ presente: true }).eq('id', id);
    if (error) throw error;
  },
};
