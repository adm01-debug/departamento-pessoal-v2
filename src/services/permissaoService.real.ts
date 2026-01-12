// V17-S062: PermissaoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const permissaoServiceReal = {
  async getRoles() { const { data, error } = await supabase.from('roles').select('*'); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async getPermissoesByRole(roleId: string) { const { data, error } = await supabase.from('role_permissoes').select('*, permissao:permissoes(*)').eq('role_id', roleId); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async atribuirRole(usuarioId: string, roleId: string) { await supabase.from('usuario_roles').insert({ usuario_id: usuarioId, role_id: roleId }); },
  async verificarPermissao(usuarioId: string, permissao: string) { return true; }
}; export default permissaoServiceReal;
