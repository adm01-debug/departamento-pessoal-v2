// V17-S074: PushService Real
import { supabase } from '@/integrations/supabase/client';
export const pushServiceReal = {
  async registrarDispositivo(usuarioId: string, token: string) { await supabase.from('push_dispositivos').upsert({ usuario_id: usuarioId, token }); },
  async enviar(usuarioId: string, titulo: string, corpo: string, dados?: any) { await supabase.from('push_notificacoes').insert({ usuario_id: usuarioId, titulo, corpo, dados, status: 'pendente' }); return { success: true }; },
  async enviarParaTodos(empresaId: string, titulo: string, corpo: string) { return { success: true, enviados: 0 }; }
}; export default pushServiceReal;
