// Logger centralizado para o sistema
// Em desenvolvimento: console.log
// Em produção: pode ser integrado com serviço de monitoramento

const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log('[DP]', ...args);
  },
  error: (message: string, error?: unknown) => {
    if (isDev) console.error('[DP Error]', message, error);
    // Em produção, enviar para serviço de monitoramento
  },
  warn: (message: string, ...args: unknown[]) => {
    if (isDev) console.warn('[DP Warn]', message, ...args);
  },
  info: (message: string, ...args: unknown[]) => {
    if (isDev) console.info('[DP Info]', message, ...args);
  }
};
