import { supabase } from '@/integrations/supabase/client';

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  papel: 'admin' | 'gestor' | 'usuario';
  ativo: boolean;
  avatar_url?: string;
  ultimo_acesso?: string;
  created_at: string;
}

export const usuariosService = {
  async listar(): Promise<Usuario[]> {
    const { data, error } = await supabase.from('usuarios').select('id, email, nome, papel, ativo').order('nome');
    if (error) throw error;
    return data ?? [];
  },

  async buscarPorId(id: string): Promise<Usuario | null> {
    const { data, error } = await supabase.from('usuarios').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async atualizar(id: string, dados: Partial<Usuario>): Promise<Usuario> {
    const { data, error } = await supabase.from('usuarios').update(dados).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async desativar(id: string): Promise<void> {
    const { error } = await supabase.from('usuarios').update({ ativo: false }).eq('id', id);
    if (error) throw error;
  },

  async ativar(id: string): Promise<void> {
    const { error } = await supabase.from('usuarios').update({ ativo: true }).eq('id', id);
    if (error) throw error;
  },
};

export default usuariosService;
