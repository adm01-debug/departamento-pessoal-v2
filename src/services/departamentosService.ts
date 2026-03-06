// @ts-nocheck
/**
 * @fileoverview Service para operações de departamentos
 * @module services/departamentosService
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface Departamento {
  id: string;
  nome: string;
  gestor_id?: string;
  empresa_id?: string;
  created_at?: string;
}

export const departamentosService = {
  async listar(empresa_id?: string): Promise<Departamento[]> {
    try {
      let query = supabase.from('departamentos').select('id, nome, gestor_id, empresa_id');
      if (empresa_id) query = query.eq('empresa_id', empresa_id);
      const { data, error } = await query.order('nome');
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logger.error('Erro ao listar departamentos:', error);
      throw error;
    }
  },

  async criar(dados: Omit<Departamento, 'id' | 'created_at'>): Promise<Departamento> {
    try {
      const { data, error } = await supabase.from('departamentos').insert(dados).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar departamento:', error);
      throw error;
    }
  },

  async atualizar(id: string, dados: Partial<Departamento>): Promise<Departamento> {
    try {
      const { data, error } = await supabase.from('departamentos').update(dados).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar departamento:', error);
      throw error;
    }
  },

  async excluir(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('departamentos').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      logger.error('Erro ao excluir departamento:', error);
      throw error;
    }
  },
};

export default departamentosService;
