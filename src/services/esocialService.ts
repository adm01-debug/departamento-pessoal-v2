import { supabase } from '@/integrations/supabase/client';
import { validarEvento, getValidadoresDisponiveis, type ValidationResult } from '@/validators/esocialValidators';

export interface ESocialEvento {
  id: string;
  empresa_id: string | null;
  tipo_evento: string;
  dados: Record<string, unknown> | null;
  competencia: string | null;
  status: string | null;
  data_envio: string | null;
  protocolo: string | null;
  erros: Record<string, unknown> | null;
  xml: string | null;
  created_at: string;
  updated_at: string;
}

const eventoDescricao: Record<string, string> = {
  'S-1000': 'Informações do Empregador',
  'S-1005': 'Tabela de Estabelecimentos',
  'S-1010': 'Tabela de Rubricas',
  'S-1020': 'Lotações Tributárias',
  'S-1200': 'Remuneração de Trabalhador',
  'S-1210': 'Pagamentos de Rendimentos',
  'S-1280': 'Informações Complementares',
  'S-2200': 'Cadastramento Inicial / Admissão',
  'S-2205': 'Alteração de Dados Cadastrais',
  'S-2206': 'Alteração Contratual',
  'S-2230': 'Afastamento Temporário',
  'S-2299': 'Desligamento',
  'S-2300': 'Trabalhador Sem Vínculo - Início',
  'S-2399': 'Trabalhador Sem Vínculo - Término',
};

export function getEventoDescricao(tipo: string): string {
  return eventoDescricao[tipo] || tipo;
}

export async function listarEventos(empresaId: string | null) {
  let query = supabase
    .from('esocial_eventos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (empresaId) {
    query = query.eq('empresa_id', empresaId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as ESocialEvento[];
}

export async function obterEstatisticas(empresaId: string | null) {
  const eventos = await listarEventos(empresaId);

  const enviados = eventos.filter(e => e.status === 'enviado').length;
  const pendentes = eventos.filter(e => e.status === 'pendente').length;
  const erros = eventos.filter(e => e.status === 'erro').length;
  const total = eventos.length;
  const conformidade = total > 0 ? Math.round(((total - erros) / total) * 100) : 100;

  return { enviados, pendentes, erros, conformidade };
}

export async function criarEvento(evento: {
  empresa_id: string;
  tipo_evento: string;
  competencia?: string;
  dados?: Record<string, unknown>;
}) {
  const { data, error } = await supabase
    .from('esocial_eventos')
    .insert([{
      empresa_id: evento.empresa_id,
      tipo_evento: evento.tipo_evento,
      competencia: evento.competencia || new Date().toISOString().slice(0, 7),
      dados: (evento.dados || {}) as any,
      status: 'pendente',
    }])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as ESocialEvento;
}

export async function validarAnteDeEnviar(tipoEvento: string, dados: Record<string, unknown>): Promise<ValidationResult> {
  return validarEvento(tipoEvento, dados);
}

export function listarEventosValidaveis(): string[] {
  return getValidadoresDisponiveis();
}

export async function enviarEvento(eventoId: string, empresaId: string) {
  // Fetch the event to validate before sending
  const { data: evento } = await supabase.from('esocial_eventos').select('*').eq('id', eventoId).maybeSingle();
  if (evento?.dados && evento?.tipo_evento) {
    const validacao = validarEvento(evento.tipo_evento, evento.dados as Record<string, any>);
    if (!validacao.valid) {
      await supabase.from('esocial_eventos').update({
        status: 'erro',
        erros: { validacao: validacao.errors } as any,
      }).eq('id', eventoId);
      return { success: false, error: 'Falha na validação', validacao };
    }
  }

  const { data, error } = await supabase.functions.invoke('enviar-esocial', {
    body: { empresaId, eventoId },
  });
  if (error) throw error;

  await supabase.from('esocial_eventos').update({
    status: data?.success ? 'enviado' : 'erro',
    protocolo: data?.protocolo || null,
    xml: data?.xml || null,
    data_envio: data?.success ? new Date().toISOString() : null,
    erros: data?.success ? null : { mensagem: data?.error },
  }).eq('id', eventoId);

  return data;
}

export async function reenviarEvento(eventoId: string, empresaId: string) {
  return enviarEvento(eventoId, empresaId);
}

export { type ValidationResult } from '@/validators/esocialValidators';
