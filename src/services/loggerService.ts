import { supabase } from '@/integrations/supabase/client';

type LogLevel = 'info' | 'warn' | 'error' | 'fatal';

export const loggerService = {
  async log(nivel: LogLevel, mensagem: string, contexto: Record<string, any> = {}, stackTrace?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('logs_sistema' as any).insert({
        nivel,
        mensagem,
        contexto,
        stack_trace: stackTrace || new Error().stack,
        user_id: user?.id,
        url: window.location.href,
        user_agent: navigator.userAgent
      });

      if (nivel === 'error' || nivel === 'fatal') {
        console.error(`[${nivel.toUpperCase()}] ${mensagem}`, contexto);
      }
    } catch (e) {
      // Fallback para console se o banco falhar
      console.warn('Falha ao enviar log para o banco:', e);
      console.log(`[${nivel.toUpperCase()}] ${mensagem}`, contexto);
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
