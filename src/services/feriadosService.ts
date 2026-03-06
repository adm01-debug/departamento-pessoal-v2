// @ts-nocheck
/**
 * @fileoverview Service para operações de feriados
 * @module services/feriadosService
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface Feriado {
  id: string;
  data: string;
  nome: string;
  tipo: 'nacional' | 'estadual' | 'municipal' | 'ponto_facultativo';
  uf?: string;
  cidade?: string;
}

export const feriadosService = {
  async listar(ano?: number, uf?: string): Promise<Feriado[]> {
    try {
      let query = supabase.from('feriados').select('id, data, nome, tipo, uf, cidade');
      if (ano) {
        query = query.gte('data', `${ano}-01-01`).lte('data', `${ano}-12-31`);
      }
      if (uf) query = query.or(`uf.is.null,uf.eq.${uf}`);
      const { data, error } = await query.order('data');
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logger.error('Erro ao listar feriados:', error);
      throw error;
    }
  },

  async criar(dados: Omit<Feriado, 'id'>): Promise<Feriado> {
    try {
      const { data, error } = await supabase.from('feriados').insert(dados).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar feriado:', error);
      throw error;
    }
  },

  async excluir(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('feriados').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      logger.error('Erro ao excluir feriado:', error);
      throw error;
    }
  },

  async isFeriado(data: string, uf?: string): Promise<boolean> {
    try {
      const feriados = await this.listar(undefined, uf);
      return feriados.some(f => f.data === data);
    } catch (error) {
      logger.error('Erro ao verificar feriado:', error);
      throw error;
    }
  },
};

export default feriadosService;
