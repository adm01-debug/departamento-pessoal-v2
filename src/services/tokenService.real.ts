// V17-S070: TokenService Real
import { supabase } from '@/integrations/supabase/client';
export const tokenServiceReal = {
  async criar(usuarioId: string, tipo: string, expiraEm: Date) { const token = crypto.randomUUID(); await supabase.from('tokens').insert({ usuario_id: usuarioId, token, tipo, expira_em: expiraEm.toISOString() }); return token; },
  async validar(token: string) { const { data } = await supabase.from('tokens').select('*').eq('token', token).gt('expira_em', new Date().toISOString()).single(); return !!data; },
  async invalidar(token: string) { await supabase.from('tokens').delete().eq('token', token); }
}; export default tokenServiceReal;
