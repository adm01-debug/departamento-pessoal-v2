import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Edge Function: Cálculo Completo de Folha de Pagamento
 * @version V8.1 - Corrigido por análise QA - Tabelas 2025
 */

// ============================================
// TABELAS 2025
// ============================================

// Tabela INSS Progressiva 2025
const TABELA_INSS = [
  { limite: 1518.00, aliquota: 0.075 },
  { limite: 2793.88, aliquota: 0.09 },
  { limite: 4190.83, aliquota: 0.12 },
  { limite: 8157.41, aliquota: 0.14 },
];

// Tabela IRRF 2025
const TABELA_IRRF = [
  { limite: 2259.20, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
];

// Constantes 2025
const TETO_INSS = 8157.41;
const SALARIO_MINIMO = 1518.00;
const ALIQUOTA_FGTS = 0.08;
const ALIQUOTA_INSS_PATRONAL = 0.20;
const DEDUCAO_DEPENDENTE = 189.59;
const JORNADA_MENSAL = 220;

// ============================================
// TIPOS
// ============================================

interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  salario: number;
  dependentes: number;
  valeTransporte: number;
  planoSaude: number;
  pensaoAlimenticia: number;
  outrosDescontos: number;
  horasExtras50: number;
  horasExtras100: number;
  adicionalNoturno: number;
  comissoes: number;
  gratificacoes: number;
  dsrComissoes: number;
}

interface ResultadoFolha {
  colaboradorId: string;
  competencia: string;
  proventos: {
    salarioBase: number;
    horasExtras50: number;
    horasExtras100: number;
    adicionalNoturno: number;
    comissoes: number;
    dsrComissoes: number;
    gratificacoes: number;
    totalProventos: number;
  };
  descontos: {
    inss: number;
    irrf: number;
    valeTransporte: number;
    planoSaude: number;
    pensaoAlimenticia: number;
    outrosDescontos: number;
    totalDescontos: number;
  };
  encargos: {
    fgts: number;
    inssPatronal: number;
  };
  liquido: number;
  detalhamentoINSS: Array<{ faixa: number; base: number; aliquota: number; valor: number }>;
  faixaIRRF: number;
}

// ============================================
// FUNÇÕES DE CÁLCULO
// ============================================

function arredondar(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

function calcularINSS(remuneracao: number): { valor: number; detalhamento: any[] } {
  if (remuneracao <= 0) return { valor: 0, detalhamento: [] };
  
  const base = Math.min(remuneracao, TETO_INSS);
  let valorINSS = 0;
  let valorAnterior = 0;
  const detalhamento: any[] = [];

  for (let i = 0; i < TABELA_INSS.length; i++) {
    const faixa = TABELA_INSS[i];
    if (base > valorAnterior) {
      const baseNaFaixa = Math.min(base, faixa.limite) - valorAnterior;
      const valorFaixa = arredondar(baseNaFaixa * faixa.aliquota);
      valorINSS += valorFaixa;
      
      detalhamento.push({
        faixa: i + 1,
        base: arredondar(baseNaFaixa),
        aliquota: faixa.aliquota * 100,
        valor: valorFaixa,
      });
    }
    valorAnterior = faixa.limite;
  }

  return { valor: arredondar(valorINSS), detalhamento };
}

function calcularIRRF(baseCalculo: number, dependentes: number): { valor: number; faixa: number } {
  const deducaoDependentes = Math.max(0, dependentes) * DEDUCAO_DEPENDENTE;
  const base = baseCalculo - deducaoDependentes;
  
  if (base <= 0) return { valor: 0, faixa: 0 };

  for (let i = 0; i < TABELA_IRRF.length; i++) {
    const faixa = TABELA_IRRF[i];
    if (base <= faixa.limite) {
      const irrf = (base * faixa.aliquota) - faixa.deducao;
      return { valor: Math.max(0, arredondar(irrf)), faixa: i + 1 };
    }
  }

  const ultimaFaixa = TABELA_IRRF[TABELA_IRRF.length - 1];
  return { 
    valor: arredondar((base * ultimaFaixa.aliquota) - ultimaFaixa.deducao), 
    faixa: 5 
  };
}

function calcularHorasExtras(salario: number, he50: number, he100: number): { valorHE50: number; valorHE100: number } {
  const salarioHora = salario / JORNADA_MENSAL;
  return {
    valorHE50: arredondar(salarioHora * 1.5 * he50),
    valorHE100: arredondar(salarioHora * 2 * he100),
  };
}

function calcularAdicionalNoturno(salario: number, horasNoturnas: number): number {
  const salarioHora = salario / JORNADA_MENSAL;
  return arredondar(salarioHora * 0.2 * horasNoturnas);
}

function calcularDSR(comissoes: number, diasUteis: number = 22, domingos: number = 4): number {
  if (diasUteis === 0 || comissoes <= 0) return 0;
  return arredondar((comissoes / diasUteis) * domingos);
}

function processarFolha(colaborador: Colaborador, competencia: string): ResultadoFolha {
  // PROVENTOS
  const { valorHE50, valorHE100 } = calcularHorasExtras(
    colaborador.salario, 
    colaborador.horasExtras50 || 0, 
    colaborador.horasExtras100 || 0
  );
  
  const adicionalNoturno = calcularAdicionalNoturno(
    colaborador.salario, 
    colaborador.adicionalNoturno || 0
  );
  
  const dsrComissoes = calcularDSR(colaborador.comissoes || 0);
  
  const totalProventos = arredondar(
    colaborador.salario + 
    valorHE50 + 
    valorHE100 + 
    adicionalNoturno + 
    (colaborador.comissoes || 0) + 
    dsrComissoes + 
    (colaborador.gratificacoes || 0)
  );

  // DESCONTOS
  const inssCalculo = calcularINSS(totalProventos);
  const baseIRRF = totalProventos - inssCalculo.valor;
  const irrfCalculo = calcularIRRF(baseIRRF, colaborador.dependentes || 0);
  
  const valeTransporte = arredondar(
    Math.min(colaborador.salario * 0.06, colaborador.valeTransporte || 0)
  );
  
  const totalDescontos = arredondar(
    inssCalculo.valor + 
    irrfCalculo.valor + 
    valeTransporte + 
    (colaborador.planoSaude || 0) + 
    (colaborador.pensaoAlimenticia || 0) + 
    (colaborador.outrosDescontos || 0)
  );

  // ENCARGOS
  const fgts = arredondar(totalProventos * ALIQUOTA_FGTS);
  const inssPatronal = arredondar(totalProventos * ALIQUOTA_INSS_PATRONAL);

  // LÍQUIDO
  const liquido = arredondar(totalProventos - totalDescontos);

  return {
    colaboradorId: colaborador.id,
    competencia,
    proventos: {
      salarioBase: colaborador.salario,
      horasExtras50: valorHE50,
      horasExtras100: valorHE100,
      adicionalNoturno,
      comissoes: colaborador.comissoes || 0,
      dsrComissoes,
      gratificacoes: colaborador.gratificacoes || 0,
      totalProventos,
    },
    descontos: {
      inss: inssCalculo.valor,
      irrf: irrfCalculo.valor,
      valeTransporte,
      planoSaude: colaborador.planoSaude || 0,
      pensaoAlimenticia: colaborador.pensaoAlimenticia || 0,
      outrosDescontos: colaborador.outrosDescontos || 0,
      totalDescontos,
    },
    encargos: {
      fgts,
      inssPatronal,
    },
    liquido,
    detalhamentoINSS: inssCalculo.detalhamento,
    faixaIRRF: irrfCalculo.faixa,
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
    const { colaboradores, competencia } = await req.json();

    if (!colaboradores || !Array.isArray(colaboradores)) {
      throw new Error('Lista de colaboradores é obrigatória');
    }

    if (!competencia || !/^\d{4}-\d{2}$/.test(competencia)) {
      throw new Error('Competência é obrigatória (formato: YYYY-MM)');
    }

    // Processar cada colaborador
    const resultados = colaboradores.map((colab: Colaborador) => 
      processarFolha(colab, competencia)
    );

    // Totalizadores
    const totais = {
      totalProventos: arredondar(resultados.reduce((acc, r) => acc + r.proventos.totalProventos, 0)),
      totalDescontos: arredondar(resultados.reduce((acc, r) => acc + r.descontos.totalDescontos, 0)),
      totalLiquido: arredondar(resultados.reduce((acc, r) => acc + r.liquido, 0)),
      totalFGTS: arredondar(resultados.reduce((acc, r) => acc + r.encargos.fgts, 0)),
      totalINSSPatronal: arredondar(resultados.reduce((acc, r) => acc + r.encargos.inssPatronal, 0)),
      custoTotal: arredondar(resultados.reduce((acc, r) => 
        acc + r.proventos.totalProventos + r.encargos.fgts + r.encargos.inssPatronal, 0
      )),
      quantidadeColaboradores: resultados.length,
    };

    return new Response(
      JSON.stringify({
        success: true,
        competencia,
        versaoTabelas: '2025-01',
        processadoEm: new Date().toISOString(),
        resultados,
        totais,
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
