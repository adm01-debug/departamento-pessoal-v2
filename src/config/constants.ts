export const APP_NAME = "Sistema de Departamento Pessoal";
export const APP_VERSION = "1.0.0";

export const SALARIO_MINIMO = 1518;
export const TETO_INSS = 8157.41;

export const STATUS_COLABORADOR = {
  ATIVO: "ATIVO",
  INATIVO: "INATIVO",
  AFASTADO: "AFASTADO",
  FERIAS: "FERIAS",
  DEMITIDO: "DEMITIDO",
} as const;

export const TIPO_CONTRATO = {
  CLT: "CLT",
  PJ: "PJ",
  TEMPORARIO: "TEMPORARIO",
  ESTAGIO: "ESTAGIO",
  JOVEM_APRENDIZ: "JOVEM_APRENDIZ",
} as const;

export const STATUS_FOLHA = {
  ABERTA: "ABERTA",
  CALCULADA: "CALCULADA",
  CONFERIDA: "CONFERIDA",
  FECHADA: "FECHADA",
} as const;

export const STATUS_FERIAS = {
  PROGRAMADA: "PROGRAMADA",
  APROVADA: "APROVADA",
  EM_GOZO: "EM_GOZO",
  CONCLUIDA: "CONCLUIDA",
  CANCELADA: "CANCELADA",
} as const;

export const TIPO_EVENTO_ESOCIAL = {
  S1000: "S-1000 - Empregador",
  S1005: "S-1005 - Estabelecimentos",
  S1010: "S-1010 - Rubricas",
  S1020: "S-1020 - Lotações",
  S1200: "S-1200 - Remuneração",
  S1210: "S-1210 - Pagamentos",
  S2200: "S-2200 - Admissão",
  S2206: "S-2206 - Alteração Contratual",
  S2230: "S-2230 - Afastamento",
  S2299: "S-2299 - Desligamento",
} as const;

export const DIAS_SEMANA = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"] as const;

export const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
] as const;

export const FAIXAS_INSS = [
  { ate: 1518, aliquota: 0.075 },
  { ate: 2793.88, aliquota: 0.09 },
  { ate: 4190.83, aliquota: 0.12 },
  { ate: 8157.41, aliquota: 0.14 },
];

export const FAIXAS_IRRF = [
  { ate: 2259.20, aliquota: 0, deducao: 0 },
  { ate: 2826.65, aliquota: 0.075, deducao: 169.44 },
  { ate: 3751.05, aliquota: 0.15, deducao: 381.44 },
  { ate: 4664.68, aliquota: 0.225, deducao: 662.77 },
  { ate: Infinity, aliquota: 0.275, deducao: 896.00 },
];

export const DEDUCAO_DEPENDENTE_IRRF = 189.59;
export const ALIQUOTA_FGTS = 0.08;
