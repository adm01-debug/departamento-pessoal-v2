// @ts-nocheck
/**
 * @fileoverview Service para operações de usuários
 * @module services/usuariosService
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

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

const USUARIO_FIELDS = 'id, email, nome, papel, ativo, avatar_url, ultimo_acesso, created_at';

export const usuariosService = {
  async listar(): Promise<Usuario[]> {
    try {
      const { data, error } = await supabase.from('usuarios').select('id, email, nome, papel, ativo, avatar_url').order('nome');
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logger.error('Erro ao listar usuários:', error);
      throw error;
    }
  },

  async buscarPorId(id: string): Promise<Usuario | null> {
    try {
      const { data, error } = await supabase.from('usuarios').select(USUARIO_FIELDS).eq('id', id).single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  },

  async atualizar(id: string, dados: Partial<Usuario>): Promise<Usuario> {
    try {
      const { data, error } = await supabase.from('usuarios').update(dados).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  async desativar(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('usuarios').update({ ativo: false }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      logger.error('Erro ao desativar usuário:', error);
      throw error;
    }
  },

  async ativar(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('usuarios').update({ ativo: true }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      logger.error('Erro ao ativar usuário:', error);
      throw error;
    }
  },
};

export default usuariosService;
