// V17-S076: ComunicadoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const comunicadoServiceReal = {
  async getAll(empresaId: string) { const { data, error } = await supabase.from('comunicados').select('*').eq('empresa_id', empresaId).order('created_at', { ascending: false }); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async criar(empresaId: string, titulo: string, conteudo: string, destinatarios?: string[]) { const { data, error } = await supabase.from('comunicados').insert({ empresa_id: empresaId, titulo, conteudo, destinatarios }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async publicar(comunicadoId: string) { await supabase.from('comunicados').update({ publicado: true, publicado_em: new Date().toISOString() }).eq('id', comunicadoId); }
}; export default comunicadoServiceReal;
