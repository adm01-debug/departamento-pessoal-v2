// V20-018: Constantes Trabalhistas 2026
export const TRABALHISTAS_2026 = {
  // Salário Mínimo
  SALARIO_MINIMO: 1621.00,
  SALARIO_MINIMO_HORA: 7.37,
  SALARIO_MINIMO_DIA: 54.03,

  // INSS - Teto e Faixas
  TETO_INSS: 8475.55,
  FAIXAS_INSS: [
    { ate: 1621.00, aliquota: 7.5 },
    { ate: 2696.91, aliquota: 9 },
    { ate: 4049.10, aliquota: 12 },
    { ate: 8475.55, aliquota: 14 }
  ],

  // IRRF - Faixas
  FAIXAS_IRRF: [
    { ate: 2480.15, aliquota: 0, deducao: 0 },
    { ate: 3272.19, aliquota: 7.5, deducao: 186.01 },
    { ate: 4363.07, aliquota: 15, deducao: 431.42 },
    { ate: 5451.45, aliquota: 22.5, deducao: 758.80 },
    { ate: Infinity, aliquota: 27.5, deducao: 1031.13 }
  ],
  DEDUCAO_DEPENDENTE: 227.42,

  // FGTS
  FGTS_PERCENTUAL: 8,
  FGTS_MULTA_SEM_JUSTA_CAUSA: 40,
  FGTS_MULTA_ACORDO: 20,

  // Seguro Desemprego
  SEGURO_DESEMPREGO_TETO: 2424.11,

  // Vale Transporte
  VT_DESCONTO_MAXIMO: 6,

  // Salário Família
  SALARIO_FAMILIA_LIMITE: 1980.38,
  SALARIO_FAMILIA_COTA: 67.54,

  // Férias
  FERIAS_TERCO: 33.33,
  FERIAS_ABONO_DIAS: 10,

  // Jornada
  JORNADA_SEMANAL: 44,
  JORNADA_DIARIA: 8,
  HORA_EXTRA_50: 50,
  HORA_EXTRA_100: 100,
  ADICIONAL_NOTURNO: 20,

  // Insalubridade (base salário mínimo)
  INSALUBRIDADE_MINIMO: 10,
  INSALUBRIDADE_MEDIO: 20,
  INSALUBRIDADE_MAXIMO: 40,

  // Periculosidade
  PERICULOSIDADE: 30,

  // Aviso Prévio
  AVISO_PREVIO_MINIMO: 30,
  AVISO_PREVIO_ADICIONAL_ANO: 3,
  AVISO_PREVIO_MAXIMO: 90
} as const;

export type ConstantesTrabalhistas = typeof TRABALHISTAS_2026;
export default TRABALHISTAS_2026;
