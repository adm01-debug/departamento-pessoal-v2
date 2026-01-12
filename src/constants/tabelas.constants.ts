// V17.2-C001: Constantes de Tabelas 2025
export const SALARIO_MINIMO_2025 = 1518.00;
export const TETO_INSS_2025 = 8157.41;
export const DEDUCAO_DEPENDENTE_IRRF_2025 = 189.59;
export const LIMITE_SALARIO_FAMILIA_2025 = 1819.26;
export const VALOR_COTA_SALARIO_FAMILIA_2025 = 62.04;
export const TABELA_INSS_2025 = [
  { faixa: 1, ate: 1518.00, aliquota: 7.5, deducao: 0 },
  { faixa: 2, ate: 2793.88, aliquota: 9, deducao: 22.77 },
  { faixa: 3, ate: 4190.83, aliquota: 12, deducao: 106.59 },
  { faixa: 4, ate: 8157.41, aliquota: 14, deducao: 190.40 },
];
export const TABELA_IRRF_2025 = [
  { faixa: 1, ate: 2259.20, aliquota: 0, deducao: 0 },
  { faixa: 2, ate: 2826.65, aliquota: 7.5, deducao: 169.44 },
  { faixa: 3, ate: 3751.05, aliquota: 15, deducao: 381.44 },
  { faixa: 4, ate: 4664.68, aliquota: 22.5, deducao: 662.77 },
  { faixa: 5, ate: Infinity, aliquota: 27.5, deducao: 896.00 },
];
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
