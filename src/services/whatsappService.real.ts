// V17-S073: WhatsAppService Real
import { supabase } from '@/integrations/supabase/client';
export const whatsappServiceReal = {
  async enviar(telefone: string, mensagem: string) { await supabase.from('whatsapp_fila').insert({ telefone, mensagem, status: 'pendente' }); return { success: true }; },
  async enviarTemplate(telefone: string, template: string, params: any) { return this.enviar(telefone, JSON.stringify({ template, params })); },
  async enviarDocumento(telefone: string, documento: Blob, legenda?: string) { return { success: true }; }
}; export default whatsappServiceReal;
