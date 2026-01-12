// V17-S063: LogService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const logServiceReal = {
  async registrar(usuarioId: string, acao: string, entidade: string, entidadeId?: string, dados?: any) { await supabase.from('logs').insert({ usuario_id: usuarioId, acao, entidade, entidade_id: entidadeId, dados, created_at: new Date().toISOString() }); },
  async getAll(empresaId: string, filtros?: any) { let q = supabase.from('logs').select('*, usuario:usuarios(nome)').order('created_at', { ascending: false }).limit(100); const { data, error } = await q; if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async getByEntidade(entidade: string, entidadeId: string) { const { data, error } = await supabase.from('logs').select('*').eq('entidade', entidade).eq('entidade_id', entidadeId); if (error) throw new Error(handleSupabaseError(error)); return data || []; }
}; export default logServiceReal;
