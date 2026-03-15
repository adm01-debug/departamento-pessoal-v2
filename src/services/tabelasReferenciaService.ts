import { supabase } from '@/integrations/supabase/client';

// Helper genérico para listar tabelas de referência
async function listarReferencia(tabela: string, orderBy = 'nome') {
  const { data, error } = await supabase
    .from(tabela as any)
    .select('*')
    .order(orderBy);
  if (error) throw error;
  return data || [];
}

// =============================================
// Tabelas de Referência - Leitura
// =============================================
export const listarNacionalidades = () => listarReferencia('nacionalidades');
export const listarTiposDesligamento = () => listarReferencia('tipos_desligamento');
export const listarTiposAvisoPrevio = () => listarReferencia('tipos_aviso_previo');
export const listarTiposDeficiencia = () => listarReferencia('tipos_deficiencia');
export const listarTiposPagamento = () => listarReferencia('tipos_pagamento');
export const listarTiposSalario = () => listarReferencia('tipos_salario');
export const listarRelacionamentosDependentes = () => listarReferencia('relacionamentos_dependentes');
export const listarGenerosDocumento = () => listarReferencia('generos_documento');
export const listarTiposVisto = () => listarReferencia('tipos_visto');
export const listarCondicoesIngresso = () => listarReferencia('condicoes_ingresso');
export const listarTemposResidencia = () => listarReferencia('tempos_residencia');
export const listarDescricoesLogradouro = () => listarReferencia('descricoes_logradouro');
export const listarPaises = () => listarReferencia('paises');
export const listarCategoriasTrabalhador = () => listarReferencia('categorias_trabalhador');
export const listarRelacionamentosContatoEmergencia = () => listarReferencia('relacionamentos_contato_emergencia');
export const listarMotivosAfastamento = () => listarReferencia('motivos_afastamento');

// =============================================
// Centros de Custo (CRUD completo)
// =============================================
export async function listarCentrosCusto(empresaId?: string) {
  let query = supabase.from('centros_custo' as any).select('*').order('nome');
  if (empresaId) query = query.eq('empresa_id', empresaId);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function criarCentroCusto(centro: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('centros_custo' as any)
    .insert([centro])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function atualizarCentroCusto(id: string, dados: Record<string, unknown>) {
  const { error } = await supabase.from('centros_custo' as any).update(dados).eq('id', id);
  if (error) throw error;
}

export async function excluirCentroCusto(id: string) {
  const { error } = await supabase.from('centros_custo' as any).delete().eq('id', id);
  if (error) throw error;
}

// =============================================
// Contas Bancárias (múltiplas por colaborador)
// =============================================
export async function listarContasBancarias(colaboradorId: string) {
  const { data, error } = await supabase
    .from('contas_bancarias' as any)
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .order('principal', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function criarContaBancaria(conta: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('contas_bancarias' as any)
    .insert([conta])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function atualizarContaBancaria(id: string, dados: Record<string, unknown>) {
  const { error } = await supabase.from('contas_bancarias' as any).update(dados).eq('id', id);
  if (error) throw error;
}

export async function excluirContaBancaria(id: string) {
  const { error } = await supabase.from('contas_bancarias' as any).delete().eq('id', id);
  if (error) throw error;
}

// =============================================
// Dados de Estagiário
// =============================================
export async function obterDadosEstagiario(colaboradorId: string) {
  const { data, error } = await supabase
    .from('dados_estagiario' as any)
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function salvarDadosEstagiario(colaboradorId: string, dados: Record<string, unknown>) {
  const existing = await obterDadosEstagiario(colaboradorId);
  if (existing) {
    const { data, error } = await supabase
      .from('dados_estagiario' as any)
      .update(dados)
      .eq('id', (existing as any).id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('dados_estagiario' as any)
      .insert([{ ...dados, colaborador_id: colaboradorId }])
      .select()
      .maybeSingle();
    if (error) throw error;
    return data;
  }
}

// =============================================
// Documentos Pessoais Arquivos
// =============================================
export async function listarDocumentosPessoais(colaboradorId: string) {
  const { data, error } = await supabase
    .from('documentos_pessoais_arquivos' as any)
    .select('*')
    .eq('colaborador_id', colaboradorId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function criarDocumentoPessoal(doc: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('documentos_pessoais_arquivos' as any)
    .insert([doc])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function excluirDocumentoPessoal(id: string) {
  const { error } = await supabase.from('documentos_pessoais_arquivos' as any).delete().eq('id', id);
  if (error) throw error;
}

// =============================================
// Férias - Workflow de Aprovação
// =============================================
export async function listarFeriasAprovacoes(feriasId: string) {
  const { data, error } = await supabase
    .from('ferias_aprovacoes' as any)
    .select('*')
    .eq('ferias_id', feriasId)
    .order('created_at');
  if (error) throw error;
  return data || [];
}

export async function criarFeriasAprovacao(aprovacao: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('ferias_aprovacoes' as any)
    .insert([aprovacao])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function atualizarFeriasAprovacao(id: string, dados: Record<string, unknown>) {
  const { error } = await supabase.from('ferias_aprovacoes' as any).update(dados).eq('id', id);
  if (error) throw error;
}

// =============================================
// Férias - Arquivos
// =============================================
export async function listarFeriasArquivos(feriasId: string) {
  const { data, error } = await supabase
    .from('ferias_arquivos' as any)
    .select('*')
    .eq('ferias_id', feriasId)
    .order('created_at');
  if (error) throw error;
  return data || [];
}

export async function criarFeriasArquivo(arquivo: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('ferias_arquivos' as any)
    .insert([arquivo])
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

// =============================================
// Dependentes - Benefícios (vinculação)
// =============================================
export async function listarDependentesBeneficios(dependenteId: string) {
  const { data, error } = await supabase
    .from('dependentes_beneficios' as any)
    .select('*')
    .eq('dependente_id', dependenteId);
  if (error) throw error;
  return data || [];
}

export async function vincularDependenteBeneficio(vinculo: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('dependentes_beneficios' as any)
    .upsert([vinculo], { onConflict: 'dependente_id,beneficio_id' })
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function desvincularDependenteBeneficio(dependenteId: string, beneficioId: string) {
  const { error } = await supabase
    .from('dependentes_beneficios' as any)
    .delete()
    .eq('dependente_id', dependenteId)
    .eq('beneficio_id', beneficioId);
  if (error) throw error;
}
