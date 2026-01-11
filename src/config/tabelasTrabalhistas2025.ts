// V16-FIX: Tabelas Trabalhistas 2025 - Configurável
// Última atualização: Janeiro 2025
// Fonte: Portaria SEPRT/ME

export const SALARIO_MINIMO_2025 = 1518.00;

// Tabela INSS 2025 - Progressiva
export const TABELA_INSS_2025 = [
  { faixa: 1, de: 0, ate: 1518.00, aliquota: 7.5, deducao: 0 },
  { faixa: 2, de: 1518.01, ate: 2793.88, aliquota: 9, deducao: 22.77 },
  { faixa: 3, de: 2793.89, ate: 4190.83, aliquota: 12, deducao: 106.59 },
  { faixa: 4, de: 4190.84, ate: 8157.41, aliquota: 14, deducao: 190.40 },
];

export const TETO_INSS_2025 = 8157.41;

// Tabela IRRF 2025
export const TABELA_IRRF_2025 = [
  { faixa: 1, de: 0, ate: 2259.20, aliquota: 0, deducao: 0 },
  { faixa: 2, de: 2259.21, ate: 2826.65, aliquota: 7.5, deducao: 169.44 },
  { faixa: 3, de: 2826.66, ate: 3751.05, aliquota: 15, deducao: 381.44 },
  { faixa: 4, de: 3751.06, ate: 4664.68, aliquota: 22.5, deducao: 662.77 },
  { faixa: 5, de: 4664.69, ate: Infinity, aliquota: 27.5, deducao: 896.00 },
];

export const DEDUCAO_DEPENDENTE_IRRF_2025 = 189.59;

// Tabela Salário Família 2025
export const TABELA_SALARIO_FAMILIA_2025 = [
  { ate: 1819.26, valor: 62.04 },
];

// FGTS
export const ALIQUOTA_FGTS = 8;
export const ALIQUOTA_FGTS_MENOR_APRENDIZ = 2;
export const MULTA_FGTS_DEMISSAO_SEM_JUSTA_CAUSA = 40;

// Horas Extras
export const ADICIONAL_HORA_EXTRA_50 = 50;
export const ADICIONAL_HORA_EXTRA_100 = 100;

// Adicional Noturno
export const ADICIONAL_NOTURNO = 20;
export const HORA_NOTURNA_REDUZIDA = 52.5; // minutos

// Insalubridade (base salário mínimo)
export const INSALUBRIDADE_MINIMO = 10;
export const INSALUBRIDADE_MEDIO = 20;
export const INSALUBRIDADE_MAXIMO = 40;

// Periculosidade (base salário)
export const PERICULOSIDADE = 30;

// Funções de cálculo
export function calcularINSS(salarioBruto: number): number {
  let inss = 0;
  let salarioRestante = salarioBruto;

  for (const faixa of TABELA_INSS_2025) {
    if (salarioRestante <= 0) break;
    
    const faixaAnterior = faixa.faixa === 1 ? 0 : TABELA_INSS_2025[faixa.faixa - 2].ate;
    const baseCalculo = Math.min(salarioRestante, faixa.ate - faixaAnterior);
    
    inss += baseCalculo * (faixa.aliquota / 100);
    salarioRestante -= baseCalculo;
  }

  return Math.round(inss * 100) / 100;
}

export function calcularIRRF(baseCalculo: number, dependentes: number = 0): number {
  const deducaoDependentes = dependentes * DEDUCAO_DEPENDENTE_IRRF_2025;
  const baseIRRF = baseCalculo - deducaoDependentes;
  
  if (baseIRRF <= TABELA_IRRF_2025[0].ate) return 0;

  for (const faixa of TABELA_IRRF_2025) {
    if (baseIRRF <= faixa.ate || faixa.ate === Infinity) {
      const irrf = (baseIRRF * faixa.aliquota / 100) - faixa.deducao;
      return Math.max(0, Math.round(irrf * 100) / 100);
    }
  }

  return 0;
}

export function calcularSalarioFamilia(salario: number, filhosMenores14: number): number {
  const faixa = TABELA_SALARIO_FAMILIA_2025.find(f => salario <= f.ate);
  return faixa ? faixa.valor * filhosMenores14 : 0;
}

export function calcularFGTS(salarioBruto: number, menorAprendiz: boolean = false): number {
  const aliquota = menorAprendiz ? ALIQUOTA_FGTS_MENOR_APRENDIZ : ALIQUOTA_FGTS;
  return Math.round(salarioBruto * aliquota) / 100;
}
