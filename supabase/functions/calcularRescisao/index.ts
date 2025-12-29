import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

/**
 * Edge Function: Cálculo Completo de Rescisão Trabalhista
 * @version V8.1 - Corrigido por análise QA - Tabelas 2025
 */

// ============================================
// CONSTANTES 2025
// ============================================

const TABELA_INSS = [
  { limite: 1518.00, aliquota: 0.075 },
  { limite: 2793.88, aliquota: 0.09 },
  { limite: 4190.83, aliquota: 0.12 },
  { limite: 8157.41, aliquota: 0.14 },
];

const TABELA_IRRF = [
  { limite: 2259.20, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
];

const TETO_INSS = 8157.41;
const DEDUCAO_DEPENDENTE = 189.59;

type TipoRescisao = 
  | 'semJustaCausa'
  | 'comJustaCausa'
  | 'pedidoDemissao'
  | 'acordoMutuo'
  | 'culpaReciproca'
  | 'fimContrato';

interface DadosRescisao {
  colaboradorId: string;
  nome: string;
  cpf: string;
  salario: number;
  mediaVariaveis: number;
  dataAdmissao: string;
  dataDemissao: string;
  tipoRescisao: TipoRescisao;
  avisoPrevioTrabalhado: boolean;
  feriasVencidas: number;
  saldoFGTS: number;
  dependentesIRRF: number;
  pensaoAlimenticia: number;
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function arredondar(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

function calcularMeses(dataInicio: Date, dataFim: Date): number {
  const anos = dataFim.getFullYear() - dataInicio.getFullYear();
  const meses = dataFim.getMonth() - dataInicio.getMonth();
  return anos * 12 + meses;
}

function calcularDias(dataInicio: Date, dataFim: Date): number {
  return Math.floor((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
}

function calcularAvisoPrevio(
  dataAdmissao: Date, 
  dataDemissao: Date, 
  salarioMedio: number, 
  trabalhado: boolean,
  tipoRescisao: TipoRescisao
): { dias: number; valor: number } {
  if (tipoRescisao === 'comJustaCausa') {
    return { dias: 0, valor: 0 };
  }

  const meses = calcularMeses(dataAdmissao, dataDemissao);
  const anosCompletos = Math.floor(meses / 12);
  
  // 30 dias + 3 dias por ano, máximo 90 dias
  let dias = Math.min(30 + (anosCompletos * 3), 90);
  
  // Acordo mútuo: 50% do aviso
  if (tipoRescisao === 'acordoMutuo') {
    dias = Math.floor(dias / 2);
  }
  
  if (trabalhado) {
    return { dias, valor: 0 };
  }
  
  const valorDia = salarioMedio / 30;
  return { dias, valor: arredondar(valorDia * dias) };
}

function calcularFerias(
  salario: number,
  dataAdmissao: Date,
  dataDemissao: Date,
  feriasVencidas: number,
  diasProjecao: number = 0
): {
  vencidas: number;
  tercoVencidas: number;
  proporcionais: number;
  tercoProporcionais: number;
} {
  const valorFeriasVencidas = arredondar(salario * feriasVencidas);
  const tercoVencidas = arredondar(valorFeriasVencidas / 3);
  
  const meses = calcularMeses(dataAdmissao, dataDemissao);
  let mesesProporcional = meses % 12;
  
  mesesProporcional += Math.floor(diasProjecao / 30);
  mesesProporcional = Math.min(mesesProporcional, 12);
  
  const diasNoMes = dataDemissao.getDate();
  if (diasNoMes >= 15 && mesesProporcional < 12) {
    mesesProporcional++;
  }
  
  const proporcionais = arredondar((salario / 12) * mesesProporcional);
  const tercoProporcionais = arredondar(proporcionais / 3);
  
  return { vencidas: valorFeriasVencidas, tercoVencidas, proporcionais, tercoProporcionais };
}

function calcular13Proporcional(salario: number, dataDemissao: Date, diasProjecao: number = 0): number {
  let meses = dataDemissao.getMonth() + 1;
  meses += Math.floor(diasProjecao / 30);
  meses = Math.min(meses, 12);
  
  if (dataDemissao.getDate() >= 15 && meses < 12) {
    meses++;
  }
  
  return arredondar((salario / 12) * meses);
}

function calcularMultaFGTS(saldoFGTS: number, tipoRescisao: TipoRescisao): { 
  multa: number; 
  percentual: number; 
  saqueLiberado: number;
} {
  switch (tipoRescisao) {
    case 'semJustaCausa':
      return { multa: arredondar(saldoFGTS * 0.40), percentual: 40, saqueLiberado: saldoFGTS };
    case 'acordoMutuo':
      return { multa: arredondar(saldoFGTS * 0.20), percentual: 20, saqueLiberado: arredondar(saldoFGTS * 0.80) };
    case 'culpaReciproca':
      return { multa: arredondar(saldoFGTS * 0.20), percentual: 20, saqueLiberado: saldoFGTS };
    case 'fimContrato':
      return { multa: 0, percentual: 0, saqueLiberado: saldoFGTS };
    default:
      return { multa: 0, percentual: 0, saqueLiberado: 0 };
  }
}

function calcularINSSRescisao(base: number): number {
  if (base <= 0) return 0;
  const baseCalculo = Math.min(base, TETO_INSS);
  
  let inss = 0;
  let valorAnterior = 0;
  
  for (const faixa of TABELA_INSS) {
    if (baseCalculo > valorAnterior) {
      const baseNaFaixa = Math.min(baseCalculo, faixa.limite) - valorAnterior;
      inss += baseNaFaixa * faixa.aliquota;
    }
    valorAnterior = faixa.limite;
  }
  
  return arredondar(inss);
}

function calcularIRRFRescisao(base: number, dependentes: number): number {
  const deducao = Math.max(0, dependentes) * DEDUCAO_DEPENDENTE;
  const baseCalculo = base - deducao;
  
  if (baseCalculo <= TABELA_IRRF[0].limite) return 0;
  
  for (const faixa of TABELA_IRRF) {
    if (baseCalculo <= faixa.limite) {
      return arredondar(Math.max(0, (baseCalculo * faixa.aliquota) - faixa.deducao));
    }
  }
  
  const ultima = TABELA_IRRF[TABELA_IRRF.length - 1];
  return arredondar((baseCalculo * ultima.aliquota) - ultima.deducao);
}

function processarRescisao(dados: DadosRescisao) {
  const dataAdmissao = new Date(dados.dataAdmissao);
  const dataDemissao = new Date(dados.dataDemissao);
  const salarioMedio = dados.salario + (dados.mediaVariaveis || 0);
  
  const diasTrabalhados = calcularDias(dataAdmissao, dataDemissao);
  const anosCompletos = Math.floor(diasTrabalhados / 365);
  
  // Saldo de salário
  const diasNoMes = dataDemissao.getDate();
  const saldoSalario = arredondar((salarioMedio / 30) * diasNoMes);
  
  // Aviso prévio
  const avisoPrevio = calcularAvisoPrevio(
    dataAdmissao, 
    dataDemissao, 
    salarioMedio, 
    dados.avisoPrevioTrabalhado,
    dados.tipoRescisao
  );
  
  // Férias
  const diasProjecao = dados.avisoPrevioTrabalhado ? 0 : avisoPrevio.dias;
  const ferias = calcularFerias(salarioMedio, dataAdmissao, dataDemissao, dados.feriasVencidas, diasProjecao);
  
  // 13º
  let decimo = 0;
  if (dados.tipoRescisao !== 'comJustaCausa') {
    decimo = calcular13Proporcional(salarioMedio, dataDemissao, diasProjecao);
  }
  
  // FGTS
  const fgtsCalculo = calcularMultaFGTS(dados.saldoFGTS, dados.tipoRescisao);
  const depositoRescisorio = arredondar(saldoSalario * 0.08);
  
  // Total de proventos
  const totalProventos = arredondar(
    saldoSalario + avisoPrevio.valor + 
    ferias.vencidas + ferias.tercoVencidas + 
    ferias.proporcionais + ferias.tercoProporcionais + decimo
  );
  
  // Descontos (verbas tributáveis)
  const verbasTriputaveis = saldoSalario;
  const inss = calcularINSSRescisao(verbasTriputaveis);
  const irrf = calcularIRRFRescisao(verbasTriputaveis - inss, dados.dependentesIRRF);
  
  let avisoPrevioDesconto = 0;
  if (dados.tipoRescisao === 'pedidoDemissao' && !dados.avisoPrevioTrabalhado) {
    avisoPrevioDesconto = avisoPrevio.valor;
  }
  
  const pensao = dados.pensaoAlimenticia || 0;
  const totalDescontos = arredondar(inss + irrf + avisoPrevioDesconto + pensao);
  
  const liquido = arredondar(totalProventos - totalDescontos);
  const totalGeral = arredondar(liquido + fgtsCalculo.saqueLiberado + fgtsCalculo.multa);
  
  return {
    colaboradorId: dados.colaboradorId,
    tipoRescisao: dados.tipoRescisao,
    diasTrabalhados,
    anosCompletos,
    proventos: {
      saldoSalario,
      avisoPrevioIndenizado: avisoPrevio.valor,
      diasAvisoPrevio: avisoPrevio.dias,
      feriasVencidas: ferias.vencidas,
      tercoFeriasVencidas: ferias.tercoVencidas,
      feriasProporcionais: ferias.proporcionais,
      tercoFeriasProporcionais: ferias.tercoProporcionais,
      decimoTerceiroProporcional: decimo,
      totalProventos,
    },
    descontos: {
      inss,
      irrf,
      avisoPrevioDesconto,
      pensaoAlimenticia: pensao,
      totalDescontos,
    },
    fgts: {
      saldo: dados.saldoFGTS,
      multaRescisoria: fgtsCalculo.multa,
      percentualMulta: fgtsCalculo.percentual,
      saqueLiberado: fgtsCalculo.saqueLiberado,
      depositoRescisorio,
    },
    liquido,
    totalGeral,
  };
}

// ============================================
// HANDLER
// ============================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const dados: DadosRescisao = await req.json();

    if (!dados.colaboradorId || !dados.dataAdmissao || !dados.dataDemissao) {
      throw new Error('Dados obrigatórios: colaboradorId, dataAdmissao, dataDemissao');
    }

    if (!dados.tipoRescisao) {
      throw new Error('Tipo de rescisão é obrigatório');
    }

    const resultado = processarRescisao(dados);

    return new Response(
      JSON.stringify({
        success: true,
        versaoTabelas: '2025-01',
        processadoEm: new Date().toISOString(),
        resultado,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
