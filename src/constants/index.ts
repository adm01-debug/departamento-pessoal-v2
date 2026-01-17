// V18: Index de Constantes - Atualizado 2026

// ==============================================
// TABELAS TRABALHISTAS 2026 (PRIORITÁRIO)
// ==============================================
export * from './tabelas.constants';

// ==============================================
// eSocial
// ==============================================
export * from './esocial.constants';

// ==============================================
// Status e Tipos
// ==============================================
export * from './status.constants';
export * from './status';
export * from './tipos';

// ==============================================
// Tabelas de Dados
// ==============================================
export * from './tables';
export * from './bancos';
export * from './cbo';
export * from './cnae';
export * from './estados';
export * from './feriados';

// ==============================================
// Aplicação
// ==============================================
export * from './messages';
export * from './routes';
export * from './permissions';
export * from './queryKeys';

// ==============================================
// Re-exports convenientes
// ==============================================
export {
  SALARIO_MINIMO_2026,
  TETO_INSS_2026,
  TABELA_INSS_2026,
  TABELA_IRRF_2026,
  DEDUCAO_DEPENDENTE_IRRF_2026,
  LIMITE_SALARIO_FAMILIA_2026,
  VALOR_COTA_SALARIO_FAMILIA_2026,
  PERCENTUAL_FGTS,
  PERCENTUAL_MULTA_FGTS,
  PERCENTUAL_VT_MAXIMO,
  PERCENTUAL_PERICULOSIDADE,
  PERCENTUAIS_INSALUBRIDADE,
  PERCENTUAL_ADICIONAL_NOTURNO,
  HORAS_MES,
  DIAS_MES
} from './tabelas.constants';
