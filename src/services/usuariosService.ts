// @ts-nocheck
/**
 * @fileoverview Service para operações de usuários
 * @module services/usuariosService
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface Usuario {
  id: string;
  user_id: string;
  email?: string;
  nome: string;
  cargo?: string;
  role_display?: string;
  avatar_url?: string;
  created_at: string;
}

export const usuariosService = {
  async listar(): Promise<Usuario[]> {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('nome');
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logger.error('Erro ao listar usuários:', error);
      throw error;
    }
  },

  async buscarPorId(id: string): Promise<Usuario | null> {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('user_id', id).single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  },

  async atualizar(id: string, dados: Partial<Usuario>): Promise<Usuario> {
    try {
      const { data, error } = await supabase.from('profiles').update(dados).eq('user_id', id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },
};

export default usuariosService;
