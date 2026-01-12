// V17-S071: EmailService Real
import { supabase } from '@/integrations/supabase/client';
export const emailServiceReal = {
  async enviar(para: string, assunto: string, corpo: string, html?: string) { await supabase.from('emails_fila').insert({ para, assunto, corpo, html, status: 'pendente' }); return { success: true }; },
  async enviarTemplate(para: string, template: string, dados: any) { return this.enviar(para, template, JSON.stringify(dados)); },
  async getHistorico(empresaId: string) { const { data } = await supabase.from('emails_fila').select('*').order('created_at', { ascending: false }).limit(100); return data || []; }
}; export default emailServiceReal;
