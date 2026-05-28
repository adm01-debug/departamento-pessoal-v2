import { supabase } from '@/integrations/supabase/client';

export type LogLevel = 'info' | 'warn' | 'error' | 'fatal';

export interface LogEntry {
  nivel: LogLevel;
  mensagem: string;
  contexto: Record<string, unknown>;
  created_at: string;
  user_id?: string;
}

const MAX_LOGS_BUFFER = 50;
const logBuffer: LogEntry[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;

export const loggerService = {
  async log(nivel: LogLevel, mensagem: string, contexto: Record<string, unknown> = {}, stackTrace?: string) {
    const trace = stackTrace || (nivel === 'error' || nivel === 'fatal' ? new Error().stack : undefined);
    const enrichedContexto: Record<string, unknown> = {
      ...contexto,
      url: window.location.href,
      user_agent: navigator.userAgent,
      ...(trace ? { stack_trace: trace } : {}),
    };
    const logEntry: LogEntry = {
      nivel,
      mensagem,
      contexto: enrichedContexto,
      created_at: new Date().toISOString()
    };

    logBuffer.push(logEntry);

    if (nivel === 'error' || nivel === 'fatal') {
      if (import.meta.env.DEV) {
        console.error(`[${nivel.toUpperCase()}] ${mensagem}`, contexto);
      }
      void this.flush(); // Errors are sent immediately
    } else {
      if (import.meta.env.DEV) {
        console.debug(`[${nivel.toUpperCase()}] ${mensagem}`, contexto);
      }
      if (logBuffer.length >= MAX_LOGS_BUFFER) {
        void this.flush();
      } else if (!flushTimeout) {
        flushTimeout = setTimeout(() => {
          void this.flush();
        }, 10000); // Flush every 10s if limit not reached
      }
    }
  },

  async flush() {
    if (logBuffer.length === 0) return;
    if (flushTimeout) {
      clearTimeout(flushTimeout);
      flushTimeout = null;
    }

    // O banco corporativo externo bloqueia inserts em `logs_sistema` via RLS
    // para clientes autenticados. Como logs do front não devem quebrar a UI,
    // descartamos o buffer silenciosamente. Mantemos console em DEV.
    const logsToSend = logBuffer.splice(0, logBuffer.length);
    if (import.meta.env.DEV) {
      console.debug(`[logger] Descartando ${logsToSend.length} log(s) — persistência remota desabilitada.`);
    }
  },

  info(mensagem: string, contexto?: Record<string, unknown>) {
    void this.log('info', mensagem, contexto);
  },

  warn(mensagem: string, contexto?: Record<string, unknown>) {
    void this.log('warn', mensagem, contexto);
  },

  error(mensagem: string, contexto?: Record<string, unknown>, error?: Error) {
    void this.log('error', mensagem, contexto, error?.stack);
  },

  fatal(mensagem: string, contexto?: Record<string, unknown>, error?: Error) {
    void this.log('fatal', mensagem, contexto, error?.stack);
  }
};
