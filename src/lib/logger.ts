/**
 * @fileoverview Sistema de logging centralizado
 * @module lib/logger
 * @version V8.1 - Corrigido por análise QA
 */

// ============================================
// CONFIGURAÇÃO
// ============================================

const isDev = import.meta.env?.DEV ?? process.env.NODE_ENV === 'development';
const isTest = import.meta.env?.MODE === 'test' || process.env.NODE_ENV === 'test';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  stack?: string;
}

// Buffer para logs em produção (pode ser enviado para serviço externo)
const logBuffer: LogEntry[] = [];
const MAX_BUFFER_SIZE = 100;

// ============================================
// FORMATAÇÃO
// ============================================

function getTimestamp(): string {
  return new Date().toISOString();
}

function formatMessage(level: LogLevel, message: string): string {
  const timestamp = getTimestamp();
  const prefix = `[${timestamp}] [DP-${level.toUpperCase()}]`;
  return `${prefix} ${message}`;
}

function serializeData(data: unknown): string {
  try {
    if (data === undefined) return '';
    if (data === null) return 'null';
    if (data instanceof Error) {
      return JSON.stringify({
        name: data.name,
        message: data.message,
        stack: data.stack,
      });
    }
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

// ============================================
// BUFFER MANAGEMENT
// ============================================

function addToBuffer(entry: LogEntry): void {
  logBuffer.push(entry);
  if (logBuffer.length > MAX_BUFFER_SIZE) {
    logBuffer.shift(); // Remove o mais antigo
  }
}

function flushBuffer(): LogEntry[] {
  const entries = [...logBuffer];
  logBuffer.length = 0;
  return entries;
}

// ============================================
// LOGGER PRINCIPAL
// ============================================

export const logger = {
  /**
   * Log de debug (apenas em desenvolvimento)
   */
  debug: (message: string, data?: unknown): void => {
    if (!isDev || isTest) return;
    
    const formattedMessage = formatMessage('debug', message);
    console.debug(formattedMessage, data !== undefined ? data : '');
  },

  /**
   * Log informativo
   */
  info: (message: string, data?: unknown): void => {
    const entry: LogEntry = {
      timestamp: getTimestamp(),
      level: 'info',
      message,
      data,
    };
    
    if (isDev && !isTest) {
      const formattedMessage = formatMessage('info', message);
      console.info(formattedMessage, data !== undefined ? data : '');
    }
    
    addToBuffer(entry);
  },

  /**
   * Log de alerta
   */
  warn: (message: string, data?: unknown): void => {
    const entry: LogEntry = {
      timestamp: getTimestamp(),
      level: 'warn',
      message,
      data,
    };
    
    if (isDev && !isTest) {
      const formattedMessage = formatMessage('warn', message);
      console.warn(formattedMessage, data !== undefined ? data : '');
    }
    
    addToBuffer(entry);
  },

  /**
   * Log de erro
   */
  error: (message: string, error?: unknown): void => {
    const entry: LogEntry = {
      timestamp: getTimestamp(),
      level: 'error',
      message,
      data: error,
      stack: error instanceof Error ? error.stack : undefined,
    };
    
    if (!isTest) {
      const formattedMessage = formatMessage('error', message);
      console.error(formattedMessage, error !== undefined ? error : '');
    }
    
    addToBuffer(entry);
    
    // Em produção, aqui enviaria para serviço de monitoramento
    // Ex: Sentry, LogRocket, DataDog, etc.
    if (!isDev && typeof window !== 'undefined') {
      // window.Sentry?.captureException(error);
    }
  },

  /**
   * Log genérico (alias para info em dev, silencioso em prod)
   */
  log: (...args: unknown[]): void => {
    if (!isDev || isTest) return;
    console.log('[DP]', ...args);
  },

  /**
   * Log de performance
   */
  performance: (label: string, startTime: number): void => {
    const duration = performance.now() - startTime;
    logger.debug(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
  },

  /**
   * Agrupa logs relacionados
   */
  group: (label: string): void => {
    if (isDev && !isTest) {
      console.group(`[DP] ${label}`);
    }
  },

  /**
   * Fecha grupo de logs
   */
  groupEnd: (): void => {
    if (isDev && !isTest) {
      console.groupEnd();
    }
  },

  /**
   * Tabela de dados
   */
  table: (data: unknown): void => {
    if (isDev && !isTest) {
      console.table(data);
    }
  },

  /**
   * Retorna os logs armazenados no buffer
   */
  getBuffer: (): LogEntry[] => {
    return [...logBuffer];
  },

  /**
   * Limpa e retorna o buffer
   */
  flush: (): LogEntry[] => {
    return flushBuffer();
  },

  /**
   * Cria um logger com contexto
   */
  withContext: (context: string) => ({
    debug: (message: string, data?: unknown) => logger.debug(`[${context}] ${message}`, data),
    info: (message: string, data?: unknown) => logger.info(`[${context}] ${message}`, data),
    warn: (message: string, data?: unknown) => logger.warn(`[${context}] ${message}`, data),
    error: (message: string, error?: unknown) => logger.error(`[${context}] ${message}`, error),
  }),
};

// ============================================
// EXPORTS
// ============================================

export type { LogEntry, LogLevel };
export default logger;
