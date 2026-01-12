// V17-S067: SessaoService Real
import { supabase } from '@/integrations/supabase/client';
export const sessaoServiceReal = {
  async getSessoesAtivas(usuarioId: string) { const { data } = await supabase.from('sessoes').select('*').eq('usuario_id', usuarioId).eq('ativa', true); return data || []; },
  async encerrar(sessaoId: string) { await supabase.from('sessoes').update({ ativa: false, encerrada_em: new Date().toISOString() }).eq('id', sessaoId); },
  async encerrarTodas(usuarioId: string, exceto?: string) { let q = supabase.from('sessoes').update({ ativa: false }).eq('usuario_id', usuarioId); if (exceto) q = q.neq('id', exceto); await q; }
}; export default sessaoServiceReal;
