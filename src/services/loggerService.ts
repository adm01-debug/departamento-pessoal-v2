import { supabase } from '@/integrations/supabase/client';

type LogLevel = 'info' | 'warn' | 'error' | 'fatal';

interface LogEntry {
  nivel: LogLevel;
  mensagem: string;
  contexto: Record<string, unknown>;
  stack_trace?: string;
  url: string;
  user_agent: string;
  created_at: string;
  user_id?: string;
}

const MAX_LOGS_BUFFER = 50;
const logBuffer: LogEntry[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;

export const loggerService = {
  async log(nivel: LogLevel, mensagem: string, contexto: Record<string, unknown> = {}, stackTrace?: string) {
    const logEntry: LogEntry = {
      nivel,
      mensagem,
      contexto,
      stack_trace: stackTrace || (nivel === 'error' || nivel === 'fatal' ? new Error().stack : undefined),
      url: window.location.href,
      user_agent: navigator.userAgent,
      created_at: new Date().toISOString()
    };

    logBuffer.push(logEntry);

    if (nivel === 'error' || nivel === 'fatal') {
      if (import.meta.env.DEV) {
        console.error(`[${nivel.toUpperCase()}] ${mensagem}`, contexto);
      }
      this.flush(); // Errors are sent immediately
    } else {
      if (import.meta.env.DEV) {
        console.debug(`[${nivel.toUpperCase()}] ${mensagem}`, contexto);
      }
      if (logBuffer.length >= MAX_LOGS_BUFFER) {
        this.flush();
      } else if (!flushTimeout) {
        flushTimeout = setTimeout(() => this.flush(), 10000); // Flush every 10s if limit not reached
      }
    }
  },

  async flush() {
    if (logBuffer.length === 0) return;
    if (flushTimeout) {
      clearTimeout(flushTimeout);
      flushTimeout = null;
    }

    const logsToSend = [...logBuffer];
    logBuffer.length = 0;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      const logsWithUser = logsToSend.map(l => ({ ...l, user_id: userId }));
      
      const { error } = await supabase.from('logs_sistema').insert(logsWithUser as any);
      if (error) throw error;
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('Failed to send logs to DB:', e);
      }
    }
  },

  info(mensagem: string, contexto?: Record<string, unknown>) {
    return this.log('info', mensagem, contexto);
  },

  warn(mensagem: string, contexto?: Record<string, unknown>) {
    return this.log('warn', mensagem, contexto);
  },

  error(mensagem: string, contexto?: Record<string, unknown>, error?: Error) {
    return this.log('error', mensagem, contexto, error?.stack);
  },

  fatal(mensagem: string, contexto?: Record<string, unknown>, error?: Error) {
    return this.log('fatal', mensagem, contexto, error?.stack);
  }
};
