// V17.2-S106: AuditService Real
import { supabase } from '@/integrations/supabase/client';
export const auditServiceReal = {
  async registrar(entidade: string, entidadeId: string, acao: string, dados: any, usuarioId?: string) { await supabase.from('audit_logs').insert({ entidade, entidade_id: entidadeId, acao, dados, usuario_id: usuarioId, created_at: new Date().toISOString() }); },
  async getByEntidade(entidade: string, entidadeId: string) { const { data } = await supabase.from('audit_logs').select('*').eq('entidade', entidade).eq('entidade_id', entidadeId).order('created_at', { ascending: false }); return data || []; }
}; export default auditServiceReal;
