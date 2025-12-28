import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

/**
 * Edge Function: Cálculo do 13º Salário
 * @version V8.0 - Implementação REAL
 */

interface Dados13Salario {
  colaboradorId: string;
  salario: number;
  mediaVariaveis: number;
  dataAdmissao: string;
  anoReferencia: number;
  parcela: 1 | 2;
  mesesAfastamento: number;
  dependentesIRRF: number;
  pensaoAlimenticia: number;
}

interface Resultado13Salario {
  colaboradorId: string;
  anoReferencia: number;
  parcela: number;
  avos: number;
  proventos: {
    salarioBase: number;
    mediaVariaveis: number;
    valorBruto: number;
    valorParcela: number;
  };
  descontos: {
    inss: number;
    irrf: number;
    pensaoAlimenticia: number;
    adiantamento1Parcela: number;
    totalDescontos: number;
  };
  liquido: number;
  dataLimitePagamento: string;
}

const calcularINSS = (base: number): number => {
  const teto = 7786.02;
  const baseCalculo = Math.min(base, teto);
  let inss = 0;
  if (baseCalculo <= 1412) inss = baseCalculo * 0.075;
  else if (baseCalculo <= 2666.68) inss = 105.90 + (baseCalculo - 1412) * 0.09;
  else if (baseCalculo <= 4000.03) inss = 218.82 + (baseCalculo - 2666.68) * 0.12;
  else inss = 378.82 + (baseCalculo - 4000.03) * 0.14;
  return Number(Math.min(inss, 908.85).toFixed(2));
};

const calcularIRRF = (base: number, dependentes: number): number => {
  const deducao = dependentes * 189.59;
  const baseCalculo = base - deducao;
  if (baseCalculo <= 2259.20) return 0;
  if (baseCalculo <= 2826.65) return Number(((baseCalculo * 0.075) - 169.44).toFixed(2));
  if (baseCalculo <= 3751.05) return Number(((baseCalculo * 0.15) - 381.44).toFixed(2));
  if (baseCalculo <= 4664.68) return Number(((baseCalculo * 0.225) - 662.77).toFixed(2));
  return Number(Math.max(0, (baseCalculo * 0.275) - 896.00).toFixed(2));
};

const processar13Salario = (dados: Dados13Salario): Resultado13Salario => {
  const dataAdmissao = new Date(dados.dataAdmissao);
  const anoAdmissao = dataAdmissao.getFullYear();
  const mesAdmissao = dataAdmissao.getMonth();
  
  // Calcular avos (meses trabalhados no ano)
  let avos = 12;
  if (anoAdmissao === dados.anoReferencia) {
    // Admitido no ano de referência
    avos = 12 - mesAdmissao;
    // Se admitido após dia 15, não conta o mês
    if (dataAdmissao.getDate() > 15) avos--;
  }
  
  // Descontar meses de afastamento sem remuneração
  avos = Math.max(0, avos - (dados.mesesAfastamento || 0));
  
  // Salário médio
  const salarioMedio = dados.salario + (dados.mediaVariaveis || 0);
  
  // Valor bruto do 13º
  const valorBruto = Number(((salarioMedio / 12) * avos).toFixed(2));
  
  let valorParcela: number;
  let inss = 0;
  let irrf = 0;
  let adiantamento1Parcela = 0;
  let dataLimite: string;
  
  if (dados.parcela === 1) {
    // 1ª Parcela: 50% do bruto, sem descontos
    valorParcela = Number((valorBruto / 2).toFixed(2));
    dataLimite = `${dados.anoReferencia}-11-30`;
  } else {
    // 2ª Parcela: diferença com descontos
    adiantamento1Parcela = Number((valorBruto / 2).toFixed(2));
    
    // INSS sobre valor total
    inss = calcularINSS(valorBruto);
    
    // IRRF sobre valor total - INSS
    const baseIRRF = valorBruto - inss;
    irrf = calcularIRRF(baseIRRF, dados.dependentesIRRF);
    
    valorParcela = valorBruto;
    dataLimite = `${dados.anoReferencia}-12-20`;
  }
  
  // Pensão alimentícia
  const pensao = dados.pensaoAlimenticia || 0;
  
  // Total de descontos
  const totalDescontos = Number((inss + irrf + pensao + adiantamento1Parcela).toFixed(2));
  
  // Líquido
  const liquido = Number((valorParcela - totalDescontos).toFixed(2));
  
  return {
    colaboradorId: dados.colaboradorId,
    anoReferencia: dados.anoReferencia,
    parcela: dados.parcela,
    avos,
    proventos: {
      salarioBase: dados.salario,
      mediaVariaveis: dados.mediaVariaveis || 0,
      valorBruto,
      valorParcela,
    },
    descontos: {
      inss,
      irrf,
      pensaoAlimenticia: pensao,
      adiantamento1Parcela,
      totalDescontos,
    },
    liquido,
    dataLimitePagamento: dataLimite,
  };
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const dados: Dados13Salario = await req.json();

    if (!dados.colaboradorId || !dados.salario || !dados.dataAdmissao) {
      throw new Error('Campos obrigatórios: colaboradorId, salario, dataAdmissao');
    }

    dados.anoReferencia = dados.anoReferencia || new Date().getFullYear();
    dados.parcela = dados.parcela || 1;

    const resultado = processar13Salario(dados);

    return new Response(
      JSON.stringify({ success: true, processadoEm: new Date().toISOString(), resultado }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
