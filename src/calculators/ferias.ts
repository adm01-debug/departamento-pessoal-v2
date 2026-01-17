// V18: Calculadora de Férias - Atualizada e Documentada
// CLT Art. 129-145 - Férias Anuais

export interface ResultadoFerias {
  valorFerias: number;
  tercoConstitucional: number;
  valorAbono: number;
  tercoAbono: number;
  totalBruto: number;
  baseINSS: number;
  baseIRRF: number;
}

/**
 * Calcula férias com 1/3 constitucional
 * @param salarioBase - Salário base do colaborador
 * @param diasGozo - Dias de gozo (mín 10, máx 30)
 * @param diasAbono - Dias de abono pecuniário (máx 10)
 * @param mediaVariaveis - Média de variáveis (horas extras, comissões, etc)
 */
export function calcularFerias(
  salarioBase: number,
  diasGozo: number,
  diasAbono: number = 0,
  mediaVariaveis: number = 0
): ResultadoFerias {
  // Validações
  if (diasGozo < 10 || diasGozo > 30) {
    throw new Error("Dias de gozo deve ser entre 10 e 30");
  }
  if (diasAbono < 0 || diasAbono > 10) {
    throw new Error("Dias de abono deve ser entre 0 e 10");
  }
  if (diasGozo + diasAbono > 30) {
    throw new Error("Total de dias não pode exceder 30");
  }
  
  // Cálculos
  const salarioTotal = salarioBase + mediaVariaveis;
  const valorDia = salarioTotal / 30;
  
  const valorFerias = Math.round(valorDia * diasGozo * 100) / 100;
  const tercoConstitucional = Math.round(valorFerias / 3 * 100) / 100;
  
  const valorAbono = Math.round(valorDia * diasAbono * 100) / 100;
  const tercoAbono = Math.round(valorAbono / 3 * 100) / 100;
  
  const totalBruto = valorFerias + tercoConstitucional + valorAbono + tercoAbono;
  
  return {
    valorFerias,
    tercoConstitucional,
    valorAbono,
    tercoAbono,
    totalBruto: Math.round(totalBruto * 100) / 100,
    baseINSS: valorFerias + tercoConstitucional, // Abono é isento
    baseIRRF: totalBruto, // Tudo incide IRRF
  };
}

/**
 * Calcula dias de férias entre duas datas
 */
export function calcularDiasFerias(dataInicio: Date, dataFim: Date): number {
  const diffTime = dataFim.getTime() - dataInicio.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Calcula período aquisitivo
 */
export function calcularPeriodoAquisitivo(dataAdmissao: Date): { inicio: Date; fim: Date; completo: boolean } {
  const hoje = new Date();
  const inicio = new Date(dataAdmissao);
  const fim = new Date(inicio);
  fim.setFullYear(fim.getFullYear() + 1);
  fim.setDate(fim.getDate() - 1);
  
  return {
    inicio,
    fim,
    completo: hoje >= fim
  };
}

/**
 * Reduz dias de férias por faltas injustificadas (CLT Art. 130)
 */
export function calcularDiasFeriasPorFaltas(faltas: number): number {
  if (faltas <= 5) return 30;
  if (faltas <= 14) return 24;
  if (faltas <= 23) return 18;
  if (faltas <= 32) return 12;
  return 0; // Perde direito às férias
}

export default calcularFerias;
