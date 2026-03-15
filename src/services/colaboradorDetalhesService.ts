import { supabase } from '@/integrations/supabase/client';

// =============================================
// Dependentes
// =============================================
export async function listarDependentes(colaboradorId: string) {
  const { data, error } = await supabase
    .from('dependentes')
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function criarDependente(dependente: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('dependentes')
    .insert([dependente as any])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function atualizarDependente(id: string, dados: Record<string, unknown>) {
  const { error } = await supabase.from('dependentes').update(dados as any).eq('id', id);
  if (error) throw error;
}

export async function excluirDependente(id: string) {
  const { error } = await supabase.from('dependentes').delete().eq('id', id);
  if (error) throw error;
}

// =============================================
// Contatos de Emergência
// =============================================
export async function listarContatosEmergencia(colaboradorId: string) {
  const { data, error } = await supabase
    .from('contatos_emergencia' as any)
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function criarContatoEmergencia(contato: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('contatos_emergencia' as any)
    .insert([contato])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function excluirContatoEmergencia(id: string) {
  const { error } = await supabase.from('contatos_emergencia' as any).delete().eq('id', id);
  if (error) throw error;
}

// =============================================
// Histórico Salarial
// =============================================
export async function listarHistoricoSalarial(colaboradorId: string) {
  const { data, error } = await supabase
    .from('historico_salarial' as any)
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .order('data_vigencia', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function criarRegistroSalarial(registro: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('historico_salarial' as any)
    .insert([registro])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

// =============================================
// ASOs
// =============================================
export async function listarASOs(colaboradorId: string) {
  const { data, error } = await supabase
    .from('asos' as any)
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .order('data_exame', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function criarASO(aso: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('asos' as any)
    .insert([aso])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

// =============================================
// Formações Acadêmicas
// =============================================
export async function listarFormacoes(colaboradorId: string) {
  const { data, error } = await supabase
    .from('formacoes_academicas' as any)
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .order('ano_conclusao', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function criarFormacao(formacao: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('formacoes_academicas' as any)
    .insert([formacao])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function excluirFormacao(id: string) {
  const { error } = await supabase.from('formacoes_academicas' as any).delete().eq('id', id);
  if (error) throw error;
}

// =============================================
// Dados de Estrangeiro
// =============================================
export async function obterDadosEstrangeiro(colaboradorId: string) {
  const { data, error } = await supabase
    .from('dados_estrangeiro' as any)
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function salvarDadosEstrangeiro(colaboradorId: string, dados: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('dados_estrangeiro' as any)
    .upsert({ ...dados, colaborador_id: colaboradorId }, { onConflict: 'colaborador_id' })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

// =============================================
// Deficiências (PCD)
// =============================================
export async function obterDeficiencia(colaboradorId: string) {
  const { data, error } = await supabase
    .from('deficiencias' as any)
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function salvarDeficiencia(colaboradorId: string, dados: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('deficiencias' as any)
    .upsert({ ...dados, colaborador_id: colaboradorId }, { onConflict: 'colaborador_id' })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

// =============================================
// Período de Experiência
// =============================================
export async function obterPeriodoExperiencia(colaboradorId: string) {
  const { data, error } = await supabase
    .from('periodos_experiencia' as any)
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function salvarPeriodoExperiencia(colaboradorId: string, dados: Record<string, unknown>) {
  const existing = await obterPeriodoExperiencia(colaboradorId);
  if (existing) {
    const { data, error } = await supabase
      .from('periodos_experiencia' as any)
      .update(dados)
      .eq('id', (existing as any).id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('periodos_experiencia' as any)
      .insert([{ ...dados, colaborador_id: colaboradorId }])
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  }
}

// =============================================
// Anotações
// =============================================
export async function listarAnotacoes(colaboradorId: string) {
  const { data, error } = await supabase
    .from('anotacoes_colaborador' as any)
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .order('data', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function criarAnotacao(anotacao: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('anotacoes_colaborador' as any)
    .insert([anotacao])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function excluirAnotacao(id: string) {
  const { error } = await supabase.from('anotacoes_colaborador' as any).delete().eq('id', id);
  if (error) throw error;
}

// =============================================
// Períodos Aquisitivos
// =============================================
export async function listarPeriodosAquisitivos(colaboradorId: string) {
  const { data, error } = await supabase
    .from('periodos_aquisitivos')
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .order('inicio_aquisitivo', { ascending: false });
  if (error) throw error;
  return data || [];
}

// =============================================
// Times
// =============================================
export async function listarTimes(empresaId?: string) {
  let query = supabase.from('times' as any).select('*').order('nome');
  if (empresaId) query = query.eq('empresa_id', empresaId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function criarTime(time: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('times' as any)
    .insert([time])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// =============================================
// Tabelas de referência
// =============================================
export async function listarEtnias() {
  const { data, error } = await supabase.from('etnias' as any).select('*').order('nome');
  if (error) throw error;
  return data || [];
}

export async function listarIdentidadesGenero() {
  const { data, error } = await supabase.from('identidades_genero' as any).select('*').order('nome');
  if (error) throw error;
  return data || [];
}

export async function listarTiposAdmissao() {
  const { data, error } = await supabase.from('tipos_admissao' as any).select('*').order('nome');
  if (error) throw error;
  return data || [];
}

export async function listarTiposEstabilidade() {
  const { data, error } = await supabase.from('tipos_estabilidade' as any).select('*').order('nome');
  if (error) throw error;
  return data || [];
}

// =============================================
// Webhooks
// =============================================
export async function listarWebhooks(empresaId?: string) {
  let query = supabase.from('webhooks_config' as any).select('*').order('created_at', { ascending: false });
  if (empresaId) query = query.eq('empresa_id', empresaId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function criarWebhook(webhook: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('webhooks_config' as any)
    .insert([webhook])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function excluirWebhook(id: string) {
  const { error } = await supabase.from('webhooks_config' as any).delete().eq('id', id);
  if (error) throw error;
}

// =============================================
// Férias Coletivas
// =============================================
export async function listarFeriasColetivas(empresaId: string) {
  const { data, error } = await supabase
    .from('ferias_coletivas' as any)
    .select('*')
    .eq('empresa_id', empresaId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function criarFeriasColetivas(ferias: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('ferias_coletivas' as any)
    .insert([ferias])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// =============================================
// Campos Customizados
// =============================================
export async function listarCamposCustomizados(empresaId?: string) {
  let query = supabase.from('campos_customizados' as any).select('*').eq('ativo', true).order('ordem');
  if (empresaId) query = query.eq('empresa_id', empresaId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function criarCampoCustomizado(campo: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('campos_customizados' as any)
    .insert([campo])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function obterValoresCamposCustomizados(colaboradorId: string) {
  const { data, error } = await supabase
    .from('valores_campos_customizados' as any)
    .select('*')
    .eq('colaborador_id', colaboradorId);
  if (error) throw error;
  return data || [];
}

export async function salvarValorCampoCustomizado(campoId: string, colaboradorId: string, valor: string) {
  const { data, error } = await supabase
    .from('valores_campos_customizados' as any)
    .upsert(
      { campo_customizado_id: campoId, colaborador_id: colaboradorId, valor },
      { onConflict: 'campo_customizado_id,colaborador_id' }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}
