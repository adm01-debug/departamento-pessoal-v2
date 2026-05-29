import { supabase } from '@/integrations/supabase/client';

// Tipos locais para este módulo
type DadosInsert = any;
type DadosUpdate = any;

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

export async function criarDependente(dependente: DadosInsert) {
  const { data, error } = await supabase
    .from('dependentes')
    .insert([dependente])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function atualizarDependente(id: string, dados: DadosUpdate) {
  const { error } = await supabase.from('dependentes').update(dados).eq('id', id);
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
  return []; // Tabela contatos_emergencia não encontrada no cache do banco externo
}

export async function criarContatoEmergencia(contato: DadosInsert) {
  const { data, error } = await supabase
    .from('contatos_emergencia')
    .insert([contato])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function excluirContatoEmergencia(id: string) {
  const { error } = await supabase.from('contatos_emergencia').delete().eq('id', id);
  if (error) throw error;
}

// =============================================
// Histórico Salarial
// =============================================
export async function listarHistoricoSalarial(colaboradorId: string) {
  const { data, error } = await supabase
    .from('historico_salarial')
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .order('data_vigencia', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function criarRegistroSalarial(registro: DadosInsert) {
  const { data, error } = await supabase
    .from('historico_salarial')
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
    .from('asos')
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .order('data_exame', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function criarASO(aso: DadosInsert) {
  const { data, error } = await supabase
    .from('asos')
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
    .from('formacoes_academicas')
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .order('ano_conclusao', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function criarFormacao(formacao: DadosInsert) {
  const { data, error } = await supabase
    .from('formacoes_academicas')
    .insert([formacao])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function excluirFormacao(id: string) {
  const { error } = await supabase.from('formacoes_academicas').delete().eq('id', id);
  if (error) throw error;
}

// =============================================
// Dados de Estrangeiro
// =============================================
export async function obterDadosEstrangeiro(colaboradorId: string) {
  const { data, error } = await supabase
    .from('dados_estrangeiro')
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function salvarDadosEstrangeiro(colaboradorId: string, dados: DadosUpdate) {
  const { data, error } = await supabase
    .from('dados_estrangeiro')
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
    .from('deficiencias')
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function salvarDeficiencia(colaboradorId: string, dados: DadosUpdate) {
  const { data, error } = await supabase
    .from('deficiencias')
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
    .from('periodos_experiencia')
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function salvarPeriodoExperiencia(colaboradorId: string, dados: DadosUpdate) {
  const existing = await obterPeriodoExperiencia(colaboradorId);
  if (existing) {
    const existingRecord = existing as Record<string, unknown>;
    const { data, error } = await supabase
      .from('periodos_experiencia')
      .update(dados)
      .eq('id', String(existingRecord.id))
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('periodos_experiencia')
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
    .from('anotacoes_colaborador')
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .order('data', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function criarAnotacao(anotacao: DadosInsert) {
  const { data, error } = await supabase
    .from('anotacoes_colaborador')
    .insert([anotacao])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function excluirAnotacao(id: string) {
  const { error } = await supabase.from('anotacoes_colaborador').delete().eq('id', id);
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
  let query = supabase.from('times').select('*').order('nome');
  if (empresaId) query = query.eq('empresa_id', empresaId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function criarTime(time: DadosInsert) {
  const { data, error } = await supabase
    .from('times')
    .insert([time])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

// =============================================
// Tabelas de referência
// =============================================
export async function listarEtnias() {
  const { data, error } = await supabase.from('etnias').select('*').order('nome');
  if (error) throw error;
  return data || [];
}

export async function listarIdentidadesGenero() {
  const { data, error } = await supabase.from('identidades_genero').select('*').order('nome');
  if (error) throw error;
  return data || [];
}

export async function listarTiposAdmissao() {
  const { data, error } = await supabase.from('tipos_admissao').select('*').order('nome');
  if (error) throw error;
  return data || [];
}

export async function listarTiposEstabilidade() {
  const { data, error } = await supabase.from('tipos_estabilidade').select('*').order('nome');
  if (error) throw error;
  return data || [];
}

// =============================================
// Webhooks
// =============================================
export async function listarWebhooks(empresaId?: string) {
  let query = supabase.from('webhooks_config').select('*').order('created_at', { ascending: false });
  if (empresaId) query = query.eq('empresa_id', empresaId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function criarWebhook(webhook: DadosInsert) {
  const { data, error } = await supabase
    .from('webhooks_config')
    .insert([webhook])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function excluirWebhook(id: string) {
  const { error } = await supabase.from('webhooks_config').delete().eq('id', id);
  if (error) throw error;
}

// =============================================
// Férias Coletivas
// =============================================
export async function listarFeriasColetivas(empresaId: string) {
  const { data, error } = await supabase
    .from('ferias_coletivas')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function criarFeriasColetivas(ferias: DadosInsert) {
  const { data, error } = await supabase
    .from('ferias_coletivas')
    .insert([ferias])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

// =============================================
// Campos Customizados
// =============================================
export async function listarCamposCustomizados(empresaId?: string) {
  let query = supabase.from('campos_customizados').select('*').eq('ativo', true).order('ordem');
  if (empresaId) query = query.eq('empresa_id', empresaId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function criarCampoCustomizado(campo: DadosInsert) {
  const { data, error } = await supabase
    .from('campos_customizados')
    .insert([campo])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function obterValoresCamposCustomizados(colaboradorId: string) {
  const { data, error } = await supabase
    .from('valores_campos_customizados')
    .select('*')
    .eq('colaborador_id', colaboradorId);
  if (error) throw error;
  return data || [];
}

export async function salvarValorCampoCustomizado(
  campoId: string,
  colaboradorId: string,
  valor: string
) {
  const { data, error } = await supabase
    .from('valores_campos_customizados')
    .upsert(
      { campo_customizado_id: campoId, colaborador_id: colaboradorId, valor },
      { onConflict: 'campo_customizado_id,colaborador_id' }
    )
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}