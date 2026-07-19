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
      void this.flush();
    } else {
      if (import.meta.env.DEV) {
        console.debug(`[${nivel.toUpperCase()}] ${mensagem}`, contexto);
      }
      if (logBuffer.length >= MAX_LOGS_BUFFER) {
        void this.flush();
      } else if (!flushTimeout) {
        flushTimeout = setTimeout(() => {
          void this.flush();
        }, 10000);
      }
    }
  },

  async flush() {
    if (logBuffer.length === 0) return;
    if (flushTimeout) {
      clearTimeout(flushTimeout);
      flushTimeout = null;
    }

    const logsToSend = logBuffer.splice(0, logBuffer.length);

    // Persist error/fatal via SECURITY DEFINER RPC — bypasses RLS on audit_log_unified
    const criticalLogs = logsToSend.filter(l => l.nivel === 'error' || l.nivel === 'fatal');
    for (const entry of criticalLogs) {
      supabase.rpc('log_frontend_error', {
        p_nivel: entry.nivel,
        p_mensagem: entry.mensagem,
        p_contexto: entry.contexto as Record<string, unknown>,
      }).catch(() => {});
    }

    if (import.meta.env.DEV) {
      const skipped = logsToSend.length - criticalLogs.length;
      if (skipped > 0) {
        console.debug(`[logger] ${skipped} info/warn entries not persisted remotely.`);
      }
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
