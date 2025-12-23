// =====================================================
// CÁLCULOS TRABALHISTAS 2025
// =====================================================

// Constantes
export const JORNADA_MENSAL_PADRAO = 220; // horas mensais padrão
export const SALARIO_MINIMO_2025 = 1518; // Salário mínimo 2025
export const TETO_INSS_2025 = 8157.41; // Teto INSS 2025

// Tabela INSS 2025
const FAIXAS_INSS_2025 = [
  { limite: 1518.00, aliquota: 0.075 },
  { limite: 2793.88, aliquota: 0.09 },
  { limite: 4190.83, aliquota: 0.12 },
  { limite: 8157.41, aliquota: 0.14 },
];

// Tabela IRRF 2025
const FAIXAS_IRRF_2025 = [
  { limite: 2259.20, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
];

// Dedução por dependente IRRF 2025
export const DEDUCAO_DEPENDENTE_IRRF = 189.59;

// =====================================================
// TIPOS
// =====================================================

export interface DadosColaborador {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
  departamento: string;
  matricula?: string | null;
  salarioBase: number;
  dependentesIRRF?: number;
  jornadaMensal?: number;
}

export interface DadosPonto {
  horasExtras50: number;
  horasExtras100: number;
  horasNoturnas: number;
  diasFalta: number;
  horasAtraso: number;
  diasUteis: number;
  domingosFeriados: number;
}

export interface DadosBeneficios {
  valorVT: number;
  valorVR: number;
  valorPlanoSaude: number;
  valorPlanoOdonto: number;
  outrosDescontos?: ProventoDesconto[];
}

export interface ProventoDesconto {
  codigo: string;
  descricao: string;
  tipo: 'provento' | 'desconto';
  referencia?: number | null;
  valor: number;
  incideINSS?: boolean;
  incideIRRF?: boolean;
  incideFGTS?: boolean;
}

export interface ResultadoHolerite {
  proventos: ProventoDesconto[];
  descontos: ProventoDesconto[];
  totalProventos: number;
  totalDescontos: number;
  liquido: number;
  baseINSS: number;
  baseIRRF: number;
  baseFGTS: number;
  valorINSS: number;
  valorIRRF: number;
  valorFGTS: number;
}

export interface EncargosPatronais {
  inssPatronal: number;
  fgts: number;
  rat: number;
  terceiros: number;
  total: number;
}

// =====================================================
// FUNÇÕES DE CÁLCULO
// =====================================================

/**
 * Calcula o INSS (progressivo)
 */
/**
 * Calcula o INSS 2025 usando tabela progressiva
 * @param salarioBruto - Salário bruto do colaborador
 * @returns Valor do INSS a descontar
 */
export function calcularINSS(salarioBruto: number): number {
  let inss = 0;
  let salarioRestante = Math.min(salarioBruto, TETO_INSS_2025);
  let limiteAnterior = 0;

  for (const faixa of FAIXAS_INSS_2025) {
    if (salarioRestante <= 0) break;

    const baseCalculo = Math.min(salarioRestante, faixa.limite - limiteAnterior);
    inss += baseCalculo * faixa.aliquota;
    salarioRestante -= baseCalculo;
    limiteAnterior = faixa.limite;
  }

  return Math.round(inss * 100) / 100;
}

/**
 * Calcula o IRRF
 */
/**
 * Calcula o IRRF 2025
 * @param baseCalculo - Base de cálculo (salário - INSS - pensões)
 * @param dependentes - Número de dependentes
 * @returns Valor do IRRF a descontar
 */
export function calcularIRRF(baseCalculo: number, dependentes: number = 0): number {
  // Deduzir dependentes
  const baseDeduzida = baseCalculo - (dependentes * DEDUCAO_DEPENDENTE_IRRF);
  
  if (baseDeduzida <= FAIXAS_IRRF_2025[0].limite) {
    return 0;
  }

  for (const faixa of FAIXAS_IRRF_2025) {
    if (baseDeduzida <= faixa.limite) {
      const irrf = (baseDeduzida * faixa.aliquota) - faixa.deducao;
      return Math.max(0, Math.round(irrf * 100) / 100);
    }
  }

  // Última faixa
  const ultimaFaixa = FAIXAS_IRRF_2025[FAIXAS_IRRF_2025.length - 1];
  const irrf = (baseDeduzida * ultimaFaixa.aliquota) - ultimaFaixa.deducao;
  return Math.max(0, Math.round(irrf * 100) / 100);
}

/**
 * Calcula o FGTS
 */
/**
 * Calcula o FGTS (8% da base)
 * @param baseFGTS - Base de cálculo do FGTS
 * @returns Valor do FGTS
 */
export function calcularFGTS(baseFGTS: number): number {
  return Math.round(baseFGTS * 0.08 * 100) / 100;
}

/**
 * Calcula encargos patronais
 */
/**
 * Calcula encargos patronais (INSS patronal, RAT, terceiros, FGTS)
 * @param baseSalarial - Base salarial para cálculo
 * @returns Objeto com todos os encargos patronais
 */
export function calcularEncargosPatronais(baseSalarial: number): EncargosPatronais {
  const inssPatronal = baseSalarial * 0.20; // 20% INSS patronal
  const fgts = baseSalarial * 0.08; // 8% FGTS
  const rat = baseSalarial * 0.02; // 2% RAT (média)
  const terceiros = baseSalarial * 0.058; // 5.8% Sistema S

  return {
    inssPatronal: Math.round(inssPatronal * 100) / 100,
    fgts: Math.round(fgts * 100) / 100,
    rat: Math.round(rat * 100) / 100,
    terceiros: Math.round(terceiros * 100) / 100,
    total: Math.round((inssPatronal + fgts + rat + terceiros) * 100) / 100,
  };
}

/**
 * Calcula holerite completo
 */
/**
 * Calcula o holerite completo do colaborador
 * @param dados - Dados do colaborador e folha
 * @returns Holerite calculado com todos os proventos e descontos
 */
export function calcularHolerite(
  colaborador: DadosColaborador,
  ponto: DadosPonto,
  beneficios: DadosBeneficios,
  eventosVariaveis: ProventoDesconto[] = []
): ResultadoHolerite {
  const proventos: ProventoDesconto[] = [];
  const descontos: ProventoDesconto[] = [];
  
  const jornadaMensal = colaborador.jornadaMensal || JORNADA_MENSAL_PADRAO;
  const valorHora = colaborador.salarioBase / jornadaMensal;
  const valorDia = colaborador.salarioBase / 30;

  // 1. Salário Base
  proventos.push({
    codigo: '001',
    descricao: 'Salário Base',
    tipo: 'provento',
    valor: colaborador.salarioBase,
    incideINSS: true,
    incideIRRF: true,
    incideFGTS: true,
  });

  // 2. Horas Extras 50%
  if (ponto.horasExtras50 > 0) {
    const valorHE50 = valorHora * 1.5 * ponto.horasExtras50;
    proventos.push({
      codigo: '003',
      descricao: 'Hora Extra 50%',
      tipo: 'provento',
      referencia: ponto.horasExtras50,
      valor: Math.round(valorHE50 * 100) / 100,
      incideINSS: true,
      incideIRRF: true,
      incideFGTS: true,
    });
  }

  // 3. Horas Extras 100%
  if (ponto.horasExtras100 > 0) {
    const valorHE100 = valorHora * 2 * ponto.horasExtras100;
    proventos.push({
      codigo: '004',
      descricao: 'Hora Extra 100%',
      tipo: 'provento',
      referencia: ponto.horasExtras100,
      valor: Math.round(valorHE100 * 100) / 100,
      incideINSS: true,
      incideIRRF: true,
      incideFGTS: true,
    });
  }

  // 4. Adicional Noturno
  if (ponto.horasNoturnas > 0) {
    const valorAN = valorHora * 0.2 * ponto.horasNoturnas;
    proventos.push({
      codigo: '005',
      descricao: 'Adicional Noturno',
      tipo: 'provento',
      referencia: ponto.horasNoturnas,
      valor: Math.round(valorAN * 100) / 100,
      incideINSS: true,
      incideIRRF: true,
      incideFGTS: true,
    });
  }

  // 5. DSR (sobre horas extras)
  const totalHE = (ponto.horasExtras50 * valorHora * 1.5) + (ponto.horasExtras100 * valorHora * 2);
  if (totalHE > 0 && ponto.diasUteis > 0) {
    const dsr = (totalHE / ponto.diasUteis) * ponto.domingosFeriados;
    proventos.push({
      codigo: '008',
      descricao: 'DSR s/ Horas Extras',
      tipo: 'provento',
      valor: Math.round(dsr * 100) / 100,
      incideINSS: true,
      incideIRRF: true,
      incideFGTS: true,
    });
  }

  // 6. Descontos de faltas
  if (ponto.diasFalta > 0) {
    const descontoFalta = valorDia * ponto.diasFalta;
    descontos.push({
      codigo: '101',
      descricao: 'Faltas',
      tipo: 'desconto',
      referencia: ponto.diasFalta,
      valor: Math.round(descontoFalta * 100) / 100,
    });

    // DSR perdido
    if (ponto.diasUteis > 0) {
      const dsrPerdido = (valorDia * ponto.diasFalta / ponto.diasUteis) * ponto.domingosFeriados;
      descontos.push({
        codigo: '102',
        descricao: 'DSR s/ Faltas',
        tipo: 'desconto',
        valor: Math.round(dsrPerdido * 100) / 100,
      });
    }
  }

  // 7. Benefícios (VT, VR, Planos)
  if (beneficios.valorVT > 0) {
    const descontoVT = Math.min(beneficios.valorVT, colaborador.salarioBase * 0.06);
    descontos.push({
      codigo: '151',
      descricao: 'Vale Transporte (6%)',
      tipo: 'desconto',
      valor: Math.round(descontoVT * 100) / 100,
    });
  }

  if (beneficios.valorPlanoSaude > 0) {
    descontos.push({
      codigo: '161',
      descricao: 'Plano de Saúde',
      tipo: 'desconto',
      valor: beneficios.valorPlanoSaude,
    });
  }

  if (beneficios.valorPlanoOdonto > 0) {
    descontos.push({
      codigo: '162',
      descricao: 'Plano Odontológico',
      tipo: 'desconto',
      valor: beneficios.valorPlanoOdonto,
    });
  }

  // 8. Eventos variáveis
  for (const evento of eventosVariaveis) {
    if (evento.tipo === 'provento') {
      proventos.push(evento);
    } else {
      descontos.push(evento);
    }
  }

  // Calcular totais
  let totalProventos = proventos.reduce((sum, p) => sum + p.valor, 0);
  let totalDescontosParcial = descontos.reduce((sum, d) => sum + d.valor, 0);

  // Base INSS (proventos que incidem)
  const baseINSS = proventos
    .filter(p => p.incideINSS)
    .reduce((sum, p) => sum + p.valor, 0);

  // Calcular INSS
  const valorINSS = calcularINSS(baseINSS);
  descontos.push({
    codigo: '201',
    descricao: 'INSS',
    tipo: 'desconto',
    valor: valorINSS,
  });

  // Base IRRF (proventos que incidem - INSS)
  const baseIRRF = proventos
    .filter(p => p.incideIRRF)
    .reduce((sum, p) => sum + p.valor, 0) - valorINSS;

  // Calcular IRRF
  const valorIRRF = calcularIRRF(baseIRRF, colaborador.dependentesIRRF || 0);
  if (valorIRRF > 0) {
    descontos.push({
      codigo: '202',
      descricao: 'IRRF',
      tipo: 'desconto',
      valor: valorIRRF,
    });
  }

  // Base FGTS
  const baseFGTS = proventos
    .filter(p => p.incideFGTS)
    .reduce((sum, p) => sum + p.valor, 0);

  // FGTS (não é descontado do colaborador, mas registramos)
  const valorFGTS = calcularFGTS(baseFGTS);

  // Total de descontos final
  const totalDescontos = descontos.reduce((sum, d) => sum + d.valor, 0);
  
  // Líquido
  const liquido = Math.round((totalProventos - totalDescontos) * 100) / 100;

  return {
    proventos,
    descontos,
    totalProventos: Math.round(totalProventos * 100) / 100,
    totalDescontos: Math.round(totalDescontos * 100) / 100,
    liquido,
    baseINSS: Math.round(baseINSS * 100) / 100,
    baseIRRF: Math.round(baseIRRF * 100) / 100,
    baseFGTS: Math.round(baseFGTS * 100) / 100,
    valorINSS,
    valorIRRF,
    valorFGTS,
  };
}

// Export additional utils from calculosTrabalhistas for backwards compatibility
export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

