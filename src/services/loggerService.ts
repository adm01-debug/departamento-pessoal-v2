import { supabase } from '@/integrations/supabase/client';

type LogLevel = 'info' | 'warn' | 'error' | 'fatal';

const MAX_LOGS_BUFFER = 50;
const logBuffer: any[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;

export const loggerService = {
  async log(nivel: LogLevel, mensagem: string, contexto: Record<string, any> = {}, stackTrace?: string) {
    const logEntry = {
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
      console.error(`[${nivel.toUpperCase()}] ${mensagem}`, contexto);
      this.flush(); // Erros são enviados imediatamente
    } else {
      console.log(`[${nivel.toUpperCase()}] ${mensagem}`, contexto);
      if (logBuffer.length >= MAX_LOGS_BUFFER) {
        this.flush();
      } else if (!flushTimeout) {
        flushTimeout = setTimeout(() => this.flush(), 10000); // Flush a cada 10s se não atingir limite
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
      const { data: { user } } = await supabase.auth.getUser();
      const logsWithUser = logsToSend.map(l => ({ ...l, user_id: user?.id }));
      
      const { error } = await supabase.from('logs_sistema' as any).insert(logsWithUser);
      if (error) throw error;
    } catch (e) {
      console.warn('Falha ao enviar lote de logs para o banco:', e);
      // Opcional: Re-inserir logs no buffer se falhar conexão? 
      // Para evitar loop infinito em falha de DB, apenas descartamos após logar no console.
    }
  },

  info(mensagem: string, contexto?: Record<string, any>) {
    return this.log('info', mensagem, contexto);
  },

  warn(mensagem: string, contexto?: Record<string, any>) {
    return this.log('warn', mensagem, contexto);
  },

  error(mensagem: string, contexto?: Record<string, any>, error?: any) {
    return this.log('error', mensagem, contexto, error?.stack);
  },

  fatal(mensagem: string, contexto?: Record<string, any>, error?: any) {
    return this.log('fatal', mensagem, contexto, error?.stack);
  }
};
