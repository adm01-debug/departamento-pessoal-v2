// @ts-nocheck
// V17-S061: UsuarioService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const usuarioServiceReal = {
  async getAll(empresaId: string) { const { data, error } = await supabase.from('usuarios').select('*').eq('empresa_id', empresaId); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async getById(id: string) { const { data, error } = await supabase.from('usuarios').select('*').eq('id', id).single(); if (error?.code === 'PGRST116') return null; if (error) throw new Error(handleSupabaseError(error)); return data; },
  async create(usuario: any) { const { data, error } = await supabase.from('usuarios').insert(usuario).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async update(id: string, usuario: any) { const { data, error } = await supabase.from('usuarios').update(usuario).eq('id', id).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async delete(id: string) { await supabase.from('usuarios').update({ ativo: false }).eq('id', id); },
  async resetSenha(id: string) { return { success: true }; }
}; export default usuarioServiceReal;
