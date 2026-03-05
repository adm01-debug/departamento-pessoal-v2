// @ts-nocheck
/**
 * @fileoverview Service para operações de benefícios
 * @module services/beneficiosService
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface Beneficio {
  id: string;
  colaborador_id: string;
  tipo: 'vt' | 'vr' | 'va' | 'plano_saude' | 'plano_odonto' | 'seguro_vida' | 'outro';
  valor: number;
  data_inicio: string;
  data_fim?: string;
  status: 'ativo' | 'inativo';
  observacoes?: string;
}

export const beneficiosService = {
  async listar(colaborador_id?: string): Promise<Beneficio[]> {
    try {
      let query = supabase.from('beneficios').select('id, colaborador_id, tipo, valor, data_inicio, data_fim, status, observacoes');
      if (colaborador_id) query = query.eq('colaborador_id', colaborador_id);
      const { data, error } = await query.order('tipo');
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logger.error('Erro ao listar benefícios:', error);
      throw error;
    }
  },

  async criar(dados: Omit<Beneficio, 'id'>): Promise<Beneficio> {
    try {
      const { data, error } = await supabase.from('beneficios').insert(dados).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar benefício:', error);
      throw error;
    }
  },

  async atualizar(id: string, dados: Partial<Beneficio>): Promise<Beneficio> {
    try {
      const { data, error } = await supabase.from('beneficios').update(dados).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar benefício:', error);
      throw error;
    }
  },

  async desativar(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('beneficios').update({ status: 'inativo', data_fim: new Date().toISOString().split('T')[0] }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      logger.error('Erro ao desativar benefício:', error);
      throw error;
    }
  },

  async calcularTotal(colaborador_id: string): Promise<number> {
    try {
      const beneficios = await this.listar(colaborador_id);
      return beneficios.filter(b => b.status === 'ativo').reduce((sum, b) => sum + (b.valor ?? 0), 0);
    } catch (error) {
      logger.error('Erro ao calcular total de benefícios:', error);
      throw error;
    }
  },
};

export default beneficiosService;
