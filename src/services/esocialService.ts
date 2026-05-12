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
  'S-2210': 'Comunicação de Acidente de Trabalho (CAT)',
  'S-2220': 'Monitoramento da Saúde do Trabalhador (ASO)',
  'S-2230': 'Afastamento Temporário',
  'S-2240': 'Condições Ambientais do Trabalho (Agentes Nocivos)',
  'S-2299': 'Desligamento',
  'S-2300': 'Trabalhador Sem Vínculo - Início',
  'S-2306': 'Trabalhador Sem Vínculo - Alteração',
  'S-2399': 'Trabalhador Sem Vínculo - Término',
  'S-2400': 'Cadastro de Beneficiário - Entes Federados',
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

export async function listarEventosPorCompetencia(empresaId: string | null, competencia: string) {
  let query = supabase
    .from('esocial_eventos')
    .select('*')
    .eq('competencia', competencia);

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
  // 1. Marcar como "processando" para feedback imediato na UI
  await supabase.from('esocial_eventos').update({ status: 'processando' }).eq('id', eventoId);

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


export async function gerarEventosPeriodo(empresaId: string, competencia: string) {
  // 1. Buscar itens da folha do período
  const { data: itens, error: iError } = await supabase
    .from('folha_itens')
    .select('*, colaboradores(*), folhas_pagamento!inner(*)')
    .eq('folhas_pagamento.empresa_id', empresaId)
    .eq('folhas_pagamento.competencia', competencia);

  if (iError) throw iError;

  const resultados = { criados: 0, pulados: 0, erros: 0 };

  for (const item of (itens || [])) {
    try {
      const colaborador = Array.isArray(item.colaboradores) ? item.colaboradores[0] : item.colaboradores;
      if (!colaborador) continue;

      // Verificar se já existe S-1200 para este colaborador/competência
      const { data: existente } = await supabase
        .from('esocial_eventos')
        .select('id')
        .eq('empresa_id', empresaId)
        .eq('tipo_evento', 'S-1200')
        .eq('competencia', competencia)
        .contains('dados', { cpfTrab: colaborador.cpf })
        .maybeSingle();

      if (existente) {
        resultados.pulados++;
        continue;
      }

      // Montar dados do S-1200 (Remuneração)
      const dadosS1200 = {
        cpfTrab: colaborador.cpf,
        perApur: competencia,
        dmDev: [{
          ideDmDev: `DM${item.id.slice(0, 5)}`,
          infoPerApur: {
            ideEstabLot: [{
              tpInsc: 1,
              nrInsc: empresaId.replace(/-/g, '').slice(0, 14), // Mock CNPJ
              detVerbas: [
                { codRubr: '1000', vrRubr: Number(item.salario_base || 0) },
                { codRubr: '9201', vrRubr: Number(item.inss_mes || 0) },
                { codRubr: '9202', vrRubr: Number(item.fgts_mes || 0) }
              ]
            }]
          }
        }]
      };

      await criarEvento({
        empresa_id: empresaId,
        tipo_evento: 'S-1200',
        competencia,
        dados: dadosS1200
      });

      // Se o item estiver pago, criar S-1210 (Pagamento)
      if (item.status_pagamento === 'pago') {
        const dadosS1210 = {
          cpfTrab: colaborador.cpf,
          perApur: competencia,
          infoPgto: [{
            dtPgto: new Date().toISOString().split('T')[0],
            tpPgto: 1,
            vlrLiq: Number(item.total_liquido || 0)
          }]
        };

        await criarEvento({
          empresa_id: empresaId,
          tipo_evento: 'S-1210',
          competencia,
          dados: dadosS1210
        });
      }

      resultados.criados++;
    } catch (err) {
      console.error('Erro ao gerar evento para item da folha:', item.id, err);
      resultados.erros++;
    }
  }

  return resultados;
}

export async function getConfig(empresaId: string) {
  const { data, error } = await supabase
    .from('configuracoes_esocial')
    .select('*, certificado:certificados_digitais(*)')
    .eq('empresa_id', empresaId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function salvarConfig(config: { empresa_id: string; ambiente: string; certificado_id?: string }) {
  const { error } = await supabase
    .from('configuracoes_esocial')
    .upsert(config, { onConflict: 'empresa_id' });
  if (error) throw error;
}

export async function listarCertificados(empresaId: string) {
  const { data, error } = await supabase
    .from('certificados_digitais')
    .select('*')
    .eq('empresa_id', empresaId);
  if (error) throw error;
  return data || [];
}

export async function adicionarCertificado(cert: {
  empresa_id: string;
  subject: string;
  issuer: string;
  valid_from: string;
  valid_to: string;
  arquivo_base64: string;
  senha_encriptada: string;
  cnpj_cpf: string;
}) {
  const { data, error } = await supabase
    .from('certificados_digitais')
    .insert([{ ...cert, ativo: true }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export { type ValidationResult } from '@/validators/esocialValidators';
