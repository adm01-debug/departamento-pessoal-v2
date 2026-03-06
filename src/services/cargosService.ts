// @ts-nocheck
/**
 * @fileoverview Service para operações de cargos
 * @module services/cargosService
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface Cargo {
  id: string;
  nome: string;
  departamento_id?: string;
  cbo?: string;
  salario_base?: number;
  created_at?: string;
}

export const cargosService = {
  async listar(departamento_id?: string): Promise<Cargo[]> {
    try {
      let query = supabase.from('cargos').select('id, nome, departamento_id, cbo, salario_base');
      if (departamento_id) query = query.eq('departamento_id', departamento_id);
      const { data, error } = await query.order('nome');
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logger.error('Erro ao listar cargos:', error);
      throw error;
    }
  },

  async criar(dados: Omit<Cargo, 'id' | 'created_at'>): Promise<Cargo> {
    try {
      const { data, error } = await supabase.from('cargos').insert(dados).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar cargo:', error);
      throw error;
    }
  },

  async atualizar(id: string, dados: Partial<Cargo>): Promise<Cargo> {
    try {
      const { data, error } = await supabase.from('cargos').update(dados).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar cargo:', error);
      throw error;
    }
  },

  async excluir(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('cargos').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      logger.error('Erro ao excluir cargo:', error);
      throw error;
    }
  },
};

export default cargosService;
