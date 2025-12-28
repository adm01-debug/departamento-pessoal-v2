import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

/**
 * Edge Function: Cálculo Completo de Férias
 * @version V8.0 - Implementação REAL
 */

interface DadosFerias {
  colaboradorId: string;
  salario: number;
  mediaVariaveis: number;
  dataAdmissao: string;
  dataInicioFerias: string;
  diasFerias: number;
  abonoEnabled: boolean;
  dependentesIRRF: number;
  adiantamento13: boolean;
}

interface ResultadoFerias {
  colaboradorId: string;
  periodoAquisitivo: { inicio: string; fim: string };
  periodoGozo: { inicio: string; fim: string };
  diasGozo: number;
  diasAbono: number;
  proventos: {
    feriasIntegrais: number;
    tercoConstitucional: number;
    abonoPecuniario: number;
    tercoAbono: number;
    adiantamento13: number;
    totalBruto: number;
  };
  descontos: {
    inss: number;
    irrf: number;
    totalDescontos: number;
  };
  liquido: number;
  dataLimitePagamento: string;
}

// Tabela INSS 2024
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

// Tabela IRRF 2024
const calcularIRRF = (base: number, dependentes: number): number => {
  const deducao = dependentes * 189.59;
  const baseCalculo = base - deducao;
  
  if (baseCalculo <= 2259.20) return 0;
  if (baseCalculo <= 2826.65) return Number(((baseCalculo * 0.075) - 169.44).toFixed(2));
  if (baseCalculo <= 3751.05) return Number(((baseCalculo * 0.15) - 381.44).toFixed(2));
  if (baseCalculo <= 4664.68) return Number(((baseCalculo * 0.225) - 662.77).toFixed(2));
  return Number(Math.max(0, (baseCalculo * 0.275) - 896.00).toFixed(2));
};

const calcularDiferencaMeses = (dataInicio: Date, dataFim: Date): number => {
  const anos = dataFim.getFullYear() - dataInicio.getFullYear();
  const meses = dataFim.getMonth() - dataInicio.getMonth();
  return anos * 12 + meses;
};

const adicionarDias = (data: Date, dias: number): Date => {
  const result = new Date(data);
  result.setDate(result.getDate() + dias);
  return result;
};

const processarFerias = (dados: DadosFerias): ResultadoFerias => {
  const dataAdmissao = new Date(dados.dataAdmissao);
  const dataInicioFerias = new Date(dados.dataInicioFerias);
  const salarioMedio = dados.salario + (dados.mediaVariaveis || 0);
  
  // Validações
  if (dados.diasFerias < 5) throw new Error('Mínimo de 5 dias de férias');
  if (dados.diasFerias > 30) throw new Error('Máximo de 30 dias de férias');
  
  // Período aquisitivo
  const mesesTrabalhados = calcularDiferencaMeses(dataAdmissao, dataInicioFerias);
  const periodosCompletos = Math.floor(mesesTrabalhados / 12);
  
  const inicioAquisitivo = new Date(dataAdmissao);
  inicioAquisitivo.setFullYear(inicioAquisitivo.getFullYear() + periodosCompletos - 1);
  const fimAquisitivo = new Date(inicioAquisitivo);
  fimAquisitivo.setFullYear(fimAquisitivo.getFullYear() + 1);
  fimAquisitivo.setDate(fimAquisitivo.getDate() - 1);
  
  // Período de gozo
  const dataFimFerias = adicionarDias(dataInicioFerias, dados.diasFerias - 1);
  
  // Cálculos de valores
  const valorDia = salarioMedio / 30;
  
  // Férias integrais
  const feriasIntegrais = Number((valorDia * dados.diasFerias).toFixed(2));
  const tercoConstitucional = Number((feriasIntegrais / 3).toFixed(2));
  
  // Abono pecuniário (venda de até 1/3 = 10 dias)
  const diasAbono = dados.abonoEnabled ? Math.min(10, Math.floor(dados.diasFerias / 3)) : 0;
  const abonoPecuniario = Number((valorDia * diasAbono).toFixed(2));
  const tercoAbono = Number((abonoPecuniario / 3).toFixed(2));
  
  // Adiantamento 13º (50% = 1ª parcela)
  const adiantamento13 = dados.adiantamento13 ? Number((salarioMedio / 2).toFixed(2)) : 0;
  
  // Total bruto
  const totalBruto = feriasIntegrais + tercoConstitucional + abonoPecuniario + tercoAbono + adiantamento13;
  
  // Descontos
  // Base INSS: apenas férias (abono é indenização, isento)
  const baseINSS = feriasIntegrais + tercoConstitucional + adiantamento13;
  const inss = calcularINSS(baseINSS);
  
  // Base IRRF: bruto - INSS (abono e 1/3 abono são isentos de IRRF)
  const baseIRRF = feriasIntegrais + tercoConstitucional + adiantamento13 - inss;
  const irrf = calcularIRRF(baseIRRF, dados.dependentesIRRF);
  
  const totalDescontos = Number((inss + irrf).toFixed(2));
  const liquido = Number((totalBruto - totalDescontos).toFixed(2));
  
  // Data limite pagamento: 2 dias antes do início
  const dataLimitePagamento = adicionarDias(dataInicioFerias, -2);
  
  return {
    colaboradorId: dados.colaboradorId,
    periodoAquisitivo: {
      inicio: inicioAquisitivo.toISOString().split('T')[0],
      fim: fimAquisitivo.toISOString().split('T')[0],
    },
    periodoGozo: {
      inicio: dados.dataInicioFerias,
      fim: dataFimFerias.toISOString().split('T')[0],
    },
    diasGozo: dados.diasFerias,
    diasAbono,
    proventos: {
      feriasIntegrais,
      tercoConstitucional,
      abonoPecuniario,
      tercoAbono,
      adiantamento13,
      totalBruto: Number(totalBruto.toFixed(2)),
    },
    descontos: {
      inss,
      irrf,
      totalDescontos,
    },
    liquido,
    dataLimitePagamento: dataLimitePagamento.toISOString().split('T')[0],
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
    const dados: DadosFerias = await req.json();

    if (!dados.colaboradorId || !dados.salario || !dados.dataAdmissao || !dados.dataInicioFerias) {
      throw new Error('Campos obrigatórios: colaboradorId, salario, dataAdmissao, dataInicioFerias');
    }

    const resultado = processarFerias(dados);

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
