import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Edge Function: Cálculo Completo de Rescisão Trabalhista
 * @version V8.0 - Implementação REAL
 */

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

interface ResultadoRescisao {
  colaboradorId: string;
  tipoRescisao: TipoRescisao;
  diasTrabalhados: number;
  anosCompletos: number;
  
  proventos: {
    saldoSalario: number;
    avisoPrevioIndenizado: number;
    diasAvisoPrevio: number;
    feriasVencidas: number;
    tercoFeriasVencidas: number;
    feriasProporcionais: number;
    tercoFeriasProporcionais: number;
    decimoTerceiroProporcional: number;
    totalProventos: number;
  };
  
  descontos: {
    inss: number;
    irrf: number;
    avisoPrevioDesconto: number;
    pensaoAlimenticia: number;
    totalDescontos: number;
  };
  
  fgts: {
    saldo: number;
    multaRescisoria: number;
    percentualMulta: number;
    saqueLiberado: number;
    depositoRescisorio: number;
  };
  
  liquido: number;
  totalGeral: number;
}

// Calcular diferença em meses
function calcularMeses(dataInicio: Date, dataFim: Date): number {
  const anos = dataFim.getFullYear() - dataInicio.getFullYear();
  const meses = dataFim.getMonth() - dataInicio.getMonth();
  return anos * 12 + meses;
}

// Calcular diferença em dias
function calcularDias(dataInicio: Date, dataFim: Date): number {
  return Math.floor((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
}

// Calcular aviso prévio proporcional
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
  return { dias, valor: Number((valorDia * dias).toFixed(2)) };
}

// Calcular férias na rescisão
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
  // Férias vencidas
  const valorFeriasVencidas = salario * feriasVencidas;
  const tercoVencidas = Number((valorFeriasVencidas / 3).toFixed(2));
  
  // Férias proporcionais
  const meses = calcularMeses(dataAdmissao, dataDemissao);
  let mesesProporcional = meses % 12;
  
  // Adicionar meses da projeção do aviso prévio
  mesesProporcional += Math.floor(diasProjecao / 30);
  mesesProporcional = Math.min(mesesProporcional, 12);
  
  // Se trabalhou mais de 14 dias no mês, conta como mês cheio
  const diasNoMes = dataDemissao.getDate();
  if (diasNoMes >= 15 && mesesProporcional < 12) {
    mesesProporcional++;
  }
  
  const proporcionais = Number(((salario / 12) * mesesProporcional).toFixed(2));
  const tercoProporcionais = Number((proporcionais / 3).toFixed(2));
  
  return {
    vencidas: valorFeriasVencidas,
    tercoVencidas,
    proporcionais,
    tercoProporcionais,
  };
}

// Calcular 13º proporcional
function calcular13Proporcional(
  salario: number,
  dataDemissao: Date,
  diasProjecao: number = 0
): number {
  let meses = dataDemissao.getMonth() + 1;
  
  // Adicionar meses da projeção
  meses += Math.floor(diasProjecao / 30);
  meses = Math.min(meses, 12);
  
  // Se trabalhou mais de 14 dias no mês, conta
  if (dataDemissao.getDate() >= 15 && meses < 12) {
    meses++;
  }
  
  return Number(((salario / 12) * meses).toFixed(2));
}

// Calcular multa FGTS
function calcularMultaFGTS(
  saldoFGTS: number,
  tipoRescisao: TipoRescisao
): { multa: number; percentual: number; saqueLiberado: number } {
  switch (tipoRescisao) {
    case 'semJustaCausa':
      return { multa: saldoFGTS * 0.40, percentual: 40, saqueLiberado: saldoFGTS };
    case 'acordoMutuo':
      return { multa: saldoFGTS * 0.20, percentual: 20, saqueLiberado: saldoFGTS * 0.80 };
    case 'culpaReciproca':
      return { multa: saldoFGTS * 0.20, percentual: 20, saqueLiberado: saldoFGTS };
    case 'fimContrato':
      return { multa: 0, percentual: 0, saqueLiberado: saldoFGTS };
    default:
      return { multa: 0, percentual: 0, saqueLiberado: 0 };
  }
}

// Cálculo INSS (simplificado para rescisão)
function calcularINSSRescisao(base: number): number {
  const teto = 7786.02;
  const baseCalculo = Math.min(base, teto);
  
  // Tabela progressiva simplificada
  let inss = 0;
  if (baseCalculo <= 1412) inss = baseCalculo * 0.075;
  else if (baseCalculo <= 2666.68) inss = 105.90 + (baseCalculo - 1412) * 0.09;
  else if (baseCalculo <= 4000.03) inss = 218.82 + (baseCalculo - 2666.68) * 0.12;
  else inss = 378.82 + (baseCalculo - 4000.03) * 0.14;
  
  return Number(Math.min(inss, 908.85).toFixed(2));
}

// Cálculo IRRF
function calcularIRRFRescisao(base: number, dependentes: number): number {
  const deducao = dependentes * 189.59;
  const baseCalculo = base - deducao;
  
  if (baseCalculo <= 2259.20) return 0;
  if (baseCalculo <= 2826.65) return Number(((baseCalculo * 0.075) - 169.44).toFixed(2));
  if (baseCalculo <= 3751.05) return Number(((baseCalculo * 0.15) - 381.44).toFixed(2));
  if (baseCalculo <= 4664.68) return Number(((baseCalculo * 0.225) - 662.77).toFixed(2));
  return Number(((baseCalculo * 0.275) - 896.00).toFixed(2));
}

// Função principal
function processarRescisao(dados: DadosRescisao): ResultadoRescisao {
  const dataAdmissao = new Date(dados.dataAdmissao);
  const dataDemissao = new Date(dados.dataDemissao);
  const salarioMedio = dados.salario + (dados.mediaVariaveis || 0);
  
  const diasTrabalhados = calcularDias(dataAdmissao, dataDemissao);
  const anosCompletos = Math.floor(diasTrabalhados / 365);
  
  // Saldo de salário
  const diasNoMes = dataDemissao.getDate();
  const saldoSalario = Number(((salarioMedio / 30) * diasNoMes).toFixed(2));
  
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
  const ferias = calcularFerias(
    salarioMedio, 
    dataAdmissao, 
    dataDemissao, 
    dados.feriasVencidas,
    diasProjecao
  );
  
  // 13º
  let decimo = 0;
  if (dados.tipoRescisao !== 'comJustaCausa') {
    decimo = calcular13Proporcional(salarioMedio, dataDemissao, diasProjecao);
  }
  
  // FGTS
  const fgtsCalculo = calcularMultaFGTS(dados.saldoFGTS, dados.tipoRescisao);
  const depositoRescisorio = Number((saldoSalario * 0.08).toFixed(2));
  
  // Total de proventos
  const totalProventos = saldoSalario + avisoPrevio.valor + 
    ferias.vencidas + ferias.tercoVencidas + 
    ferias.proporcionais + ferias.tercoProporcionais + decimo;
  
  // Descontos
  // Verbas tributáveis: saldo + aviso (não indenizado)
  const verbasTriputaveis = saldoSalario + (dados.avisoPrevioTrabalhado ? 0 : 0);
  const inss = calcularINSSRescisao(verbasTriputaveis);
  const irrf = calcularIRRFRescisao(verbasTriputaveis - inss, dados.dependentesIRRF);
  
  // Aviso prévio a descontar (pedido de demissão sem trabalhar)
  let avisoPrevioDesconto = 0;
  if (dados.tipoRescisao === 'pedidoDemissao' && !dados.avisoPrevioTrabalhado) {
    avisoPrevioDesconto = avisoPrevio.valor;
  }
  
  const pensao = dados.pensaoAlimenticia || 0;
  const totalDescontos = inss + irrf + avisoPrevioDesconto + pensao;
  
  const liquido = Number((totalProventos - totalDescontos).toFixed(2));
  const totalGeral = Number((liquido + fgtsCalculo.saqueLiberado + fgtsCalculo.multa).toFixed(2));
  
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
      totalProventos: Number(totalProventos.toFixed(2)),
    },
    descontos: {
      inss,
      irrf,
      avisoPrevioDesconto,
      pensaoAlimenticia: pensao,
      totalDescontos: Number(totalDescontos.toFixed(2)),
    },
    fgts: {
      saldo: dados.saldoFGTS,
      multaRescisoria: Number(fgtsCalculo.multa.toFixed(2)),
      percentualMulta: fgtsCalculo.percentual,
      saqueLiberado: Number(fgtsCalculo.saqueLiberado.toFixed(2)),
      depositoRescisorio,
    },
    liquido,
    totalGeral,
  };
}

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

    const resultado = processarRescisao(dados);

    return new Response(
      JSON.stringify({
        success: true,
        processadoEm: new Date().toISOString(),
        resultado,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
