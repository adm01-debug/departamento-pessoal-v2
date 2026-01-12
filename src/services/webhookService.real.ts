// V17-S101: WebhookService Real
import { supabase } from '@/integrations/supabase/client';
export const webhookServiceReal = {
  async registrar(empresaId: string, url: string, eventos: string[]) { const { data } = await supabase.from('webhooks').insert({ empresa_id: empresaId, url, eventos, ativo: true }).select().single(); return data; },
  async disparar(empresaId: string, evento: string, payload: any) { const { data: hooks } = await supabase.from('webhooks').select('url').eq('empresa_id', empresaId).contains('eventos', [evento]); return { disparados: hooks?.length || 0 }; }
}; export default webhookServiceReal;
