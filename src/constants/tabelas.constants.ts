// V17.4: Constantes de Tabelas 2026 - ATUALIZADO EM 12/01/2026
// Fonte: Portaria Interministerial MPS/MF nº 13 de 09/01/2026
// Vigência: A partir de 01/01/2026

// ============================================
// VALORES BASE 2026
// ============================================
export const SALARIO_MINIMO_2026 = 1621.00;
export const TETO_INSS_2026 = 8475.55;
export const DEDUCAO_DEPENDENTE_IRRF_2026 = 189.59; // Mantido até nova portaria IRRF
export const LIMITE_SALARIO_FAMILIA_2026 = 1980.38;
export const VALOR_COTA_SALARIO_FAMILIA_2026 = 67.54;

// ============================================
// TABELA INSS 2026 - Portaria MPS/MF nº 13/2026
// ============================================
export const TABELA_INSS_2026 = [
  { faixa: 1, ate: 1621.00, aliquota: 7.5, deducao: 0 },
  { faixa: 2, ate: 2902.84, aliquota: 9, deducao: 24.32 },
  { faixa: 3, ate: 4354.27, aliquota: 12, deducao: 111.40 },
  { faixa: 4, ate: 8475.55, aliquota: 14, deducao: 198.49 },
];

// ============================================
// TABELA IRRF 2026 - Reforma IR (isenção até R$ 5.000)
// Fonte: Secretaria de Comunicação Social - Gov.br 06/01/2026
// ============================================
export const TABELA_IRRF_2026 = [
  { faixa: 1, ate: 5000.00, aliquota: 0, deducao: 0 },      // ISENTO até R$ 5.000
  { faixa: 2, ate: 7350.00, aliquota: 7.5, deducao: 375.00 }, // Redução progressiva
  { faixa: 3, ate: 9920.00, aliquota: 15, deducao: 926.25 },
  { faixa: 4, ate: 13170.00, aliquota: 22.5, deducao: 1670.25 },
  { faixa: 5, ate: Infinity, aliquota: 27.5, deducao: 2328.75 },
];

// ============================================
// PERCENTUAIS FIXOS (não mudaram)
// ============================================
export const PERCENTUAL_FGTS = 8;
export const PERCENTUAL_MULTA_FGTS = 40;
export const PERCENTUAL_MULTA_FGTS_ACORDO = 20;
export const PERCENTUAL_VT_MAXIMO = 6;
export const PERCENTUAL_PERICULOSIDADE = 30;
export const PERCENTUAIS_INSALUBRIDADE = { minimo: 10, medio: 20, maximo: 40 };
export const PERCENTUAL_ADICIONAL_NOTURNO = 20;
export const HORAS_MES = 220;
export const DIAS_MES = 30;
export const DIAS_ANO = 360;

// ============================================
// ALIASES PARA COMPATIBILIDADE (2025 -> 2026)
// ============================================
export const SALARIO_MINIMO_2025 = SALARIO_MINIMO_2026; // Deprecated - use 2026
export const TETO_INSS_2025 = TETO_INSS_2026; // Deprecated - use 2026
export const TABELA_INSS_2025 = TABELA_INSS_2026; // Deprecated - use 2026
export const TABELA_IRRF_2025 = TABELA_IRRF_2026; // Deprecated - use 2026
export const DEDUCAO_DEPENDENTE_IRRF_2025 = DEDUCAO_DEPENDENTE_IRRF_2026;
export const LIMITE_SALARIO_FAMILIA_2025 = LIMITE_SALARIO_FAMILIA_2026;
export const VALOR_COTA_SALARIO_FAMILIA_2025 = VALOR_COTA_SALARIO_FAMILIA_2026;
