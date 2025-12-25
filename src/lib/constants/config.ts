/** Configurações da aplicação */
export const APP_CONFIG = {
  name: 'Departamento Pessoal',
  version: '1.0.0',
  defaultPageSize: 10,
  maxPageSize: 100,
  dateFormat: 'dd/MM/yyyy',
  currencyFormat: 'pt-BR',
  currency: 'BRL',
  timezone: 'America/Sao_Paulo',
} as const;

/** Limites do sistema */
export const LIMITS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFilesUpload: 10,
  maxSearchResults: 100,
  sessionTimeout: 30 * 60 * 1000, // 30 min
  cacheTime: 5 * 60 * 1000, // 5 min
} as const;

/** Feature flags */
export const FEATURES = {
  enableESocial: true,
  enableBiometria: false,
  enableAssinaturaDigital: true,
  enableRelatoriosAvancados: true,
} as const;
