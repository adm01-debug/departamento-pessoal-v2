// V15-398
import { supabase } from '@/integrations/supabase/client';
export interface Usuario { id: string; email: string; nome: string; role: 'admin' | 'rh' | 'gestor' | 'colaborador'; empresa_id?: string; ativo: boolean; ultimo_acesso?: string; }
export const usuarioService = {
  async list(empresaId?: string) { let query = supabase.from('usuarios').select('*').order('nome'); if (empresaId) query = query.eq('empresa_id', empresaId); const { data, error } = await query; if (error) throw error; return data as Usuario[]; },
  async getById(id: string) { const { data, error } = await supabase.from('usuarios').select('*').eq('id', id).single(); if (error) throw error; return data as Usuario; },
  async update(id: string, usuario: Partial<Usuario>) { const { data, error } = await supabase.from('usuarios').update(usuario).eq('id', id).select().single(); if (error) throw error; return data as Usuario; },
  async alterarSenha(userId: string, novaSenha: string) { const { error } = await supabase.auth.admin.updateUserById(userId, { password: novaSenha }); if (error) throw error; },
  async desativar(id: string) { return this.update(id, { ativo: false }); },
};
