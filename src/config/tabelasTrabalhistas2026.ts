// Tabelas Trabalhistas 2026 - Atualizadas
// QA-FIX: Tabela 2026 para cálculos trabalhistas
// Última atualização: Janeiro 2026 (estimativa baseada em projeções)

export const SALARIO_MINIMO_2026 = 1590.00; // Estimativa

// Tabela INSS 2026 - Progressiva (estimativa com reajuste ~5%)
export const TABELA_INSS_2026 = [
  { faixa: 1, de: 0, ate: 1590.00, aliquota: 7.5, deducao: 0 },
  { faixa: 2, de: 1590.01, ate: 2933.57, aliquota: 9, deducao: 23.85 },
  { faixa: 3, de: 2933.58, ate: 4400.37, aliquota: 12, deducao: 111.86 },
  { faixa: 4, de: 4400.38, ate: 8565.28, aliquota: 14, deducao: 199.87 },
];

export const TETO_INSS_2026 = 8565.28;

// Tabela IRRF 2026 (estimativa)
export const TABELA_IRRF_2026 = [
  { faixa: 1, de: 0, ate: 2372.16, aliquota: 0, deducao: 0 },
  { faixa: 2, de: 2372.17, ate: 2967.98, aliquota: 7.5, deducao: 177.91 },
  { faixa: 3, de: 2967.99, ate: 3938.60, aliquota: 15, deducao: 400.51 },
  { faixa: 4, de: 3938.61, ate: 4897.91, aliquota: 22.5, deducao: 695.91 },
  { faixa: 5, de: 4897.92, ate: Infinity, aliquota: 27.5, deducao: 940.80 },
];

export const DEDUCAO_DEPENDENTE_IRRF_2026 = 199.07;

// Tabela Salário Família 2026 (estimativa)
export const TABELA_SALARIO_FAMILIA_2026 = [
  { ate: 1910.22, valor: 65.14 },
];

// FGTS 2026
export const ALIQUOTA_FGTS_2026 = 8.0;
export const ALIQUOTA_FGTS_APRENDIZ_2026 = 2.0;
export const MULTA_FGTS_DEMISSAO_SEM_JUSTA_CAUSA_2026 = 40.0;
export const MULTA_FGTS_CULPA_RECIPROCA_2026 = 20.0;

// Encargos Patronais 2026
export const ENCARGOS_PATRONAIS_2026 = {
  inss: 20.0,
  rat: 3.0,
  terceiros: 5.8,
  fgts: 8.0,
};

// Adicionais 2026
export const ADICIONAL_NOTURNO_MINIMO_2026 = 20.0;
export const ADICIONAL_HORA_EXTRA_50_2026 = 50.0;
export const ADICIONAL_HORA_EXTRA_100_2026 = 100.0;
export const ADICIONAL_INSALUBRIDADE_MINIMO_2026 = 10.0;
export const ADICIONAL_INSALUBRIDADE_MEDIO_2026 = 20.0;
export const ADICIONAL_INSALUBRIDADE_MAXIMO_2026 = 40.0;
export const ADICIONAL_PERICULOSIDADE_2026 = 30.0;

// Export default
export const TABELAS_2026 = {
  salarioMinimo: SALARIO_MINIMO_2026,
  inss: TABELA_INSS_2026,
  tetoInss: TETO_INSS_2026,
  irrf: TABELA_IRRF_2026,
  deducaoDependente: DEDUCAO_DEPENDENTE_IRRF_2026,
  salarioFamilia: TABELA_SALARIO_FAMILIA_2026,
  fgts: {
    normal: ALIQUOTA_FGTS_2026,
    aprendiz: ALIQUOTA_FGTS_APRENDIZ_2026,
    multaSemJustaCausa: MULTA_FGTS_DEMISSAO_SEM_JUSTA_CAUSA_2026,
    multaCulpaReciproca: MULTA_FGTS_CULPA_RECIPROCA_2026,
  },
  encargosPatronais: ENCARGOS_PATRONAIS_2026,
  adicionais: {
    noturno: ADICIONAL_NOTURNO_MINIMO_2026,
    horaExtra50: ADICIONAL_HORA_EXTRA_50_2026,
    horaExtra100: ADICIONAL_HORA_EXTRA_100_2026,
    insalubridadeMinimo: ADICIONAL_INSALUBRIDADE_MINIMO_2026,
    insalubridadeMedio: ADICIONAL_INSALUBRIDADE_MEDIO_2026,
    insalubridadeMaximo: ADICIONAL_INSALUBRIDADE_MAXIMO_2026,
    periculosidade: ADICIONAL_PERICULOSIDADE_2026,
  },
};

export default TABELAS_2026;
