// V17-S072: SMSService Real
import { supabase } from '@/integrations/supabase/client';
export const smsServiceReal = {
  async enviar(telefone: string, mensagem: string) { await supabase.from('sms_fila').insert({ telefone, mensagem, status: 'pendente' }); return { success: true }; },
  async getHistorico(empresaId: string) { const { data } = await supabase.from('sms_fila').select('*').order('created_at', { ascending: false }).limit(100); return data || []; }
}; export default smsServiceReal;
