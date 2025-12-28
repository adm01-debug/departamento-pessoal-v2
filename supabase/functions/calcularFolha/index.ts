import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Edge Function: Cálculo Completo de Folha de Pagamento
 * @version V8.0 - Implementação REAL com cálculos trabalhistas
 */

// Tabela INSS Progressiva 2024
const TABELA_INSS = [
  { limite: 1412.00, aliquota: 0.075 },
  { limite: 2666.68, aliquota: 0.09 },
  { limite: 4000.03, aliquota: 0.12 },
  { limite: 7786.02, aliquota: 0.14 },
];

// Tabela IRRF 2024
const TABELA_IRRF = [
  { limite: 2259.20, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
];

const TETO_INSS = 7786.02;
const ALIQUOTA_FGTS = 0.08;
const DEDUCAO_DEPENDENTE = 189.59;

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

// Cálculo INSS Progressivo
function calcularINSS(remuneracao: number): { valor: number; detalhamento: any[] } {
  const base = Math.min(remuneracao, TETO_INSS);
  let valorINSS = 0;
  let valorAnterior = 0;
  const detalhamento: any[] = [];

  for (let i = 0; i < TABELA_INSS.length; i++) {
    const faixa = TABELA_INSS[i];
    if (base > valorAnterior) {
      const baseNaFaixa = Math.min(base, faixa.limite) - valorAnterior;
      const valorFaixa = baseNaFaixa * faixa.aliquota;
      valorINSS += valorFaixa;
      
      detalhamento.push({
        faixa: i + 1,
        base: baseNaFaixa,
        aliquota: faixa.aliquota * 100,
        valor: valorFaixa,
      });
    }
    valorAnterior = faixa.limite;
  }

  return { valor: Number(valorINSS.toFixed(2)), detalhamento };
}

// Cálculo IRRF
function calcularIRRF(baseCalculo: number, dependentes: number): { valor: number; faixa: number } {
  const deducaoDependentes = dependentes * DEDUCAO_DEPENDENTE;
  const base = baseCalculo - deducaoDependentes;
  
  if (base <= 0) return { valor: 0, faixa: 0 };

  for (let i = 0; i < TABELA_IRRF.length; i++) {
    const faixa = TABELA_IRRF[i];
    if (base <= faixa.limite) {
      const irrf = (base * faixa.aliquota) - faixa.deducao;
      return { valor: Math.max(0, Number(irrf.toFixed(2))), faixa: i + 1 };
    }
  }

  const ultimaFaixa = TABELA_IRRF[TABELA_IRRF.length - 1];
  return { 
    valor: Number(((base * ultimaFaixa.aliquota) - ultimaFaixa.deducao).toFixed(2)), 
    faixa: 5 
  };
}

// Cálculo de Horas Extras
function calcularHorasExtras(salario: number, he50: number, he100: number): { valorHE50: number; valorHE100: number } {
  const salarioHora = salario / 220;
  return {
    valorHE50: Number((salarioHora * 1.5 * he50).toFixed(2)),
    valorHE100: Number((salarioHora * 2 * he100).toFixed(2)),
  };
}

// Cálculo de Adicional Noturno
function calcularAdicionalNoturno(salario: number, horasNoturnas: number): number {
  const salarioHora = salario / 220;
  return Number((salarioHora * 0.2 * horasNoturnas).toFixed(2));
}

// Cálculo de DSR sobre Comissões
function calcularDSR(comissoes: number, diasUteis: number = 22, domingos: number = 4): number {
  if (diasUteis === 0) return 0;
  return Number(((comissoes / diasUteis) * domingos).toFixed(2));
}

// Função principal de cálculo
function processarFolha(colaborador: Colaborador, competencia: string): ResultadoFolha {
  // PROVENTOS
  const { valorHE50, valorHE100 } = calcularHorasExtras(
    colaborador.salario, 
    colaborador.horasExtras50, 
    colaborador.horasExtras100
  );
  
  const adicionalNoturno = calcularAdicionalNoturno(colaborador.salario, colaborador.adicionalNoturno);
  const dsrComissoes = calcularDSR(colaborador.comissoes);
  
  const totalProventos = 
    colaborador.salario + 
    valorHE50 + 
    valorHE100 + 
    adicionalNoturno + 
    colaborador.comissoes + 
    dsrComissoes + 
    colaborador.gratificacoes;

  // DESCONTOS
  const inssCalculo = calcularINSS(totalProventos);
  const baseIRRF = totalProventos - inssCalculo.valor;
  const irrfCalculo = calcularIRRF(baseIRRF, colaborador.dependentes);
  
  const valeTransporte = Math.min(colaborador.salario * 0.06, colaborador.valeTransporte);
  
  const totalDescontos = 
    inssCalculo.valor + 
    irrfCalculo.valor + 
    valeTransporte + 
    colaborador.planoSaude + 
    colaborador.pensaoAlimenticia + 
    colaborador.outrosDescontos;

  // ENCARGOS
  const fgts = Number((totalProventos * ALIQUOTA_FGTS).toFixed(2));
  const inssPatronal = Number((totalProventos * 0.20).toFixed(2));

  // LÍQUIDO
  const liquido = Number((totalProventos - totalDescontos).toFixed(2));

  return {
    colaboradorId: colaborador.id,
    competencia,
    proventos: {
      salarioBase: colaborador.salario,
      horasExtras50: valorHE50,
      horasExtras100: valorHE100,
      adicionalNoturno,
      comissoes: colaborador.comissoes,
      dsrComissoes,
      gratificacoes: colaborador.gratificacoes,
      totalProventos: Number(totalProventos.toFixed(2)),
    },
    descontos: {
      inss: inssCalculo.valor,
      irrf: irrfCalculo.valor,
      valeTransporte,
      planoSaude: colaborador.planoSaude,
      pensaoAlimenticia: colaborador.pensaoAlimenticia,
      outrosDescontos: colaborador.outrosDescontos,
      totalDescontos: Number(totalDescontos.toFixed(2)),
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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { colaboradores, competencia } = await req.json();

    if (!colaboradores || !Array.isArray(colaboradores)) {
      throw new Error('Lista de colaboradores é obrigatória');
    }

    if (!competencia) {
      throw new Error('Competência é obrigatória (formato: YYYY-MM)');
    }

    // Processar cada colaborador
    const resultados = colaboradores.map((colab: Colaborador) => 
      processarFolha(colab, competencia)
    );

    // Totalizadores
    const totais = {
      totalProventos: resultados.reduce((acc, r) => acc + r.proventos.totalProventos, 0),
      totalDescontos: resultados.reduce((acc, r) => acc + r.descontos.totalDescontos, 0),
      totalLiquido: resultados.reduce((acc, r) => acc + r.liquido, 0),
      totalFGTS: resultados.reduce((acc, r) => acc + r.encargos.fgts, 0),
      totalINSSPatronal: resultados.reduce((acc, r) => acc + r.encargos.inssPatronal, 0),
      quantidadeColaboradores: resultados.length,
    };

    return new Response(
      JSON.stringify({
        success: true,
        competencia,
        processadoEm: new Date().toISOString(),
        resultados,
        totais,
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
