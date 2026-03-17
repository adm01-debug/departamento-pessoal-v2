/**
 * @fileoverview Service para tabelas complementares sem cobertura no frontend
 * Cobre: ajustes_ponto, beneficiarios_plano, beneficiarios_seguro, colaborador_beneficios,
 * config_afastamentos, documento_templates, documentos_admissao, documentos_afastamento,
 * documentos_assinatura, documentos_colaborador, esocial_lotes, eventos_variaveis,
 * ferias_solicitacoes, historico_cargo, historico_ferias, lancamentos_folha,
 * linhas_transporte, log_envio_relatorios, notificacoes_admissao, onboarding_*,
 * parametros_fiscais, periodos_ponto, relatorios_agendados, rubricas_folha,
 * saved_filters, seguros_colaboradores, treinamento_participantes, bitrix24_*
 */
import { supabase } from '@/integrations/supabase/client';

// ============ AJUSTES PONTO ============
export const ajustesPontoService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('ajustes_ponto').select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (empresaId) q = q.in('colaborador_id', supabase.from('colaboradores').select('id').eq('empresa_id', empresaId) as any);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('ajustes_ponto').insert(d);
    if (error) throw error;
  },
  aprovar: async (id: string, userId: string) => {
    const { error } = await supabase.from('ajustes_ponto').update({ status: 'aprovado', aprovado_por: userId, aprovado_em: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
  },
};

// ============ BENEFICIÁRIOS PLANO SAÚDE ============
export const beneficiariosPlanoService = {
  listar: async (planoId: string) => {
    const { data, error } = await supabase.from('beneficiarios_plano').select('*, colaborador:colaboradores(nome_completo)').eq('plano_saude_id', planoId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('beneficiarios_plano').insert(d);
    if (error) throw error;
  },
  excluir: async (id: string) => {
    const { error } = await supabase.from('beneficiarios_plano').update({ status: 'excluido', data_exclusao: new Date().toISOString().split('T')[0] }).eq('id', id);
    if (error) throw error;
  },
};

// ============ BENEFICIÁRIOS SEGURO ============
export const beneficiariosSeguroService = {
  listar: async (seguroId: string) => {
    const { data, error } = await supabase.from('beneficiarios_seguro').select('*, colaborador:colaboradores(nome_completo)').eq('seguro_vida_id', seguroId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('beneficiarios_seguro').insert(d);
    if (error) throw error;
  },
  excluir: async (id: string) => {
    const { error } = await supabase.from('beneficiarios_seguro').update({ status: 'inativo' }).eq('id', id);
    if (error) throw error;
  },
};

// ============ COLABORADOR BENEFÍCIOS (join table) ============
export const colaboradorBeneficiosService = {
  listar: async (colaboradorId: string) => {
    const { data, error } = await supabase.from('colaborador_beneficios' as any).select('*').eq('colaborador_id', colaboradorId);
    if (error) throw error;
    return data || [];
  },
};

// ============ CONFIG AFASTAMENTOS ============
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

// ============ DOCUMENTO TEMPLATES ============
export const documentoTemplatesService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('documento_templates' as any).select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('documento_templates' as any).insert(d);
    if (error) throw error;
  },
};

// ============ DOCUMENTOS ADMISSÃO ============
export const documentosAdmissaoService = {
  listar: async (admissaoId: string) => {
    const { data, error } = await supabase.from('documentos_admissao' as any).select('*').eq('admissao_id', admissaoId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('documentos_admissao' as any).insert(d);
    if (error) throw error;
  },
};

// ============ DOCUMENTOS AFASTAMENTO ============
export const documentosAfastamentoService = {
  listar: async (afastamentoId: string) => {
    const { data, error } = await supabase.from('documentos_afastamento' as any).select('*').eq('afastamento_id', afastamentoId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('documentos_afastamento' as any).insert(d);
    if (error) throw error;
  },
};

// ============ DOCUMENTOS ASSINATURA ============
export const documentosAssinaturaService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('documentos_assinatura' as any).select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('documentos_assinatura' as any).insert(d);
    if (error) throw error;
  },
};

// ============ DOCUMENTOS COLABORADOR ============
export const documentosColaboradorService = {
  listar: async (colaboradorId: string) => {
    const { data, error } = await supabase.from('documentos_colaborador' as any).select('*').eq('colaborador_id', colaboradorId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('documentos_colaborador' as any).insert(d);
    if (error) throw error;
  },
};

// ============ ESOCIAL LOTES ============
export const esocialLotesService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('esocial_lotes' as any).select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('esocial_lotes' as any).insert(d);
    if (error) throw error;
  },
};

// ============ EVENTOS VARIÁVEIS ============
export const eventosVariaveisService = {
  listar: async (empresaId?: string, competencia?: string) => {
    let q = supabase.from('eventos_variaveis' as any).select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    if (competencia) q = q.eq('competencia', competencia);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('eventos_variaveis' as any).insert(d);
    if (error) throw error;
  },
  excluir: async (id: string) => {
    const { error } = await supabase.from('eventos_variaveis' as any).delete().eq('id', id);
    if (error) throw error;
  },
};

// ============ FÉRIAS SOLICITAÇÕES ============
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

// ============ HISTÓRICO CARGO ============
export const historicoCargoService = {
  listar: async (colaboradorId: string) => {
    const { data, error } = await supabase.from('historico_cargo' as any).select('*').eq('colaborador_id', colaboradorId).order('data_inicio', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};

// ============ HISTÓRICO FÉRIAS ============
export const historicoFeriasService = {
  listar: async (colaboradorId: string) => {
    const { data, error } = await supabase.from('historico_ferias' as any).select('*').eq('colaborador_id', colaboradorId).order('data_inicio', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};

// ============ LANÇAMENTOS FOLHA ============
export const lancamentosFolhaService = {
  listar: async (folhaId: string) => {
    const { data, error } = await supabase.from('lancamentos_folha' as any).select('*').eq('folha_id', folhaId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('lancamentos_folha' as any).insert(d);
    if (error) throw error;
  },
};

// ============ LINHAS TRANSPORTE ============
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

// ============ LOG ENVIO RELATÓRIOS ============
export const logEnvioRelatoriosService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('log_envio_relatorios' as any).select('*').order('created_at', { ascending: false }).limit(100);
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
};

// ============ NOTIFICAÇÕES ADMISSÃO ============
export const notificacoesAdmissaoService = {
  listar: async (admissaoId: string) => {
    const { data, error } = await supabase.from('notificacoes_admissao' as any).select('*').eq('admissao_id', admissaoId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};

// ============ ONBOARDING ============
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

// ============ PARÂMETROS FISCAIS ============
export const parametrosFiscaisService = {
  listar: async () => {
    const { data, error } = await supabase.from('parametros_fiscais' as any).select('*').order('vigencia_inicio', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('parametros_fiscais' as any).insert(d);
    if (error) throw error;
  },
};

// ============ PERÍODOS PONTO ============
export const periodosPontoService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('periodos_ponto' as any).select('*').order('data_inicio', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('periodos_ponto' as any).insert(d);
    if (error) throw error;
  },
  fechar: async (id: string) => {
    const { error } = await supabase.from('periodos_ponto' as any).update({ status: 'fechado', fechado_em: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
  },
};

// ============ RELATÓRIOS AGENDADOS ============
export const relatoriosAgendadosService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('relatorios_agendados' as any).select('*').order('created_at', { ascending: false });
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('relatorios_agendados' as any).insert(d);
    if (error) throw error;
  },
  excluir: async (id: string) => {
    const { error } = await supabase.from('relatorios_agendados' as any).delete().eq('id', id);
    if (error) throw error;
  },
};

// ============ RUBRICAS FOLHA ============
export const rubricasFolhaService = {
  listar: async (empresaId?: string) => {
    let q = supabase.from('rubricas_folha' as any).select('*').order('codigo');
    if (empresaId) q = q.eq('empresa_id', empresaId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('rubricas_folha' as any).insert(d);
    if (error) throw error;
  },
  atualizar: async (id: string, d: any) => {
    const { error } = await supabase.from('rubricas_folha' as any).update(d).eq('id', id);
    if (error) throw error;
  },
};

// ============ FILTROS SALVOS ============
export const savedFiltersService = {
  listar: async (userId: string) => {
    const { data, error } = await supabase.from('saved_filters' as any).select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  criar: async (d: any) => {
    const { error } = await supabase.from('saved_filters' as any).insert(d);
    if (error) throw error;
  },
  excluir: async (id: string) => {
    const { error } = await supabase.from('saved_filters' as any).delete().eq('id', id);
    if (error) throw error;
  },
};

// ============ SEGUROS COLABORADORES (join) ============
export const segurosColaboradoresService = {
  listar: async (seguroId?: string) => {
    let q = supabase.from('seguros_colaboradores' as any).select('*, colaborador:colaboradores(nome_completo)').order('created_at', { ascending: false });
    if (seguroId) q = q.eq('seguro_vida_id', seguroId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  },
  vincular: async (d: any) => {
    const { error } = await supabase.from('seguros_colaboradores' as any).insert(d);
    if (error) throw error;
  },
  desvincular: async (id: string) => {
    const { error } = await supabase.from('seguros_colaboradores' as any).delete().eq('id', id);
    if (error) throw error;
  },
};

// ============ TREINAMENTO PARTICIPANTES ============
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

// ============ BITRIX24 ============
export const bitrix24Service = {
  getConfig: async () => {
    const { data, error } = await supabase.from('bitrix24_config' as any).select('*').limit(1).maybeSingle();
    if (error) throw error;
    return data;
  },
  saveConfig: async (d: any) => {
    const { error } = await supabase.from('bitrix24_config' as any).upsert(d);
    if (error) throw error;
  },
  getLogs: async () => {
    const { data, error } = await supabase.from('bitrix24_sync_logs' as any).select('*').order('created_at', { ascending: false }).limit(50);
    if (error) throw error;
    return data || [];
  },
};

// ============ VIEWS (Dashboard KPIs) ============
export const viewsService = {
  alertasRH: async () => {
    const { data, error } = await supabase.from('vw_alertas_rh' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  kpiTurnover: async () => {
    const { data, error } = await supabase.from('vw_kpi_turnover' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  kpiAbsenteismo: async () => {
    const { data, error } = await supabase.from('vw_kpi_absenteismo' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  kpiBeneficiosCusto: async () => {
    const { data, error } = await supabase.from('vw_kpi_beneficios_custo' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  kpiPontoResumo: async () => {
    const { data, error } = await supabase.from('vw_kpi_ponto_resumo' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  bancoHorasSaldo: async () => {
    const { data, error } = await supabase.from('vw_banco_horas_saldo' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  feriasResumo: async () => {
    const { data, error } = await supabase.from('vw_ferias_resumo' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  faltasMensal: async () => {
    const { data, error } = await supabase.from('vw_faltas_mensal' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  cadastroIncompleto: async () => {
    const { data, error } = await supabase.from('vw_cadastro_incompleto' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  colaboradoresCompleto: async (limit = 100) => {
    const { data, error } = await supabase.from('vw_colaboradores_completo' as any).select('*').limit(limit);
    if (error) throw error;
    return data || [];
  },
  dashboardTime: async () => {
    const { data, error } = await supabase.from('vw_dashboard_time' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  batidasDia: async (data_ref: string) => {
    const { data, error } = await supabase.from('vw_batidas_dia' as any).select('*').eq('data', data_ref);
    if (error) throw error;
    return data || [];
  },
  batidasResumo: async () => {
    const { data, error } = await supabase.from('vw_batidas_resumo' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  folhaPontoMensal: async () => {
    const { data, error } = await supabase.from('vw_folha_ponto_mensal' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  alertasCompensacao: async () => {
    const { data, error } = await supabase.from('vw_alertas_compensacao' as any).select('*');
    if (error) throw error;
    return data || [];
  },
  saldoCompensacaoMensal: async () => {
    const { data, error } = await supabase.from('vw_saldo_compensacao_mensal' as any).select('*');
    if (error) throw error;
    return data || [];
  },
};
