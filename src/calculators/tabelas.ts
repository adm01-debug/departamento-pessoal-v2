// Tabelas e constantes trabalhistas 2026

export const SALARIO_MINIMO_2026 = 1518;

export const FAIXAS_INSS_2026 = [
  { limite: 1518.00, aliquota: 0.075 },
  { limite: 2793.88, aliquota: 0.09 },
  { limite: 5563.80, aliquota: 0.12 },
  { limite: 7786.93, aliquota: 0.14 },
];

export const FAIXAS_IRRF_2026 = [
  { limite: 2259.20, aliquota: 0, deducao: 0 },
  { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
];

export const DEDUCAO_DEPENDENTE_IRRF = 189.59;
export const ALIQUOTA_FGTS = 0.08;
