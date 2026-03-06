// @ts-nocheck
/**
 * @fileoverview Service para geração de relatórios
 * @module services/relatoriosService
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface Relatorio {
  id: string;
  tipo: string;
  nome: string;
  parametros?: Record<string, unknown>;
  formato?: 'pdf' | 'xlsx' | 'csv';
  status: 'pendente' | 'processando' | 'concluido' | 'erro';
  url?: string;
  created_at: string;
  usuario_id: string;
}

const RELATORIO_FIELDS = 'id, tipo, nome, parametros, formato, status, url, created_at, usuario_id';

export const relatoriosService = {
  async listar(usuario_id?: string): Promise<Relatorio[]> {
    try {
      let query = supabase.from('relatorios').select('id, tipo, nome, status, formato, created_at');
      if (usuario_id) query = query.eq('usuario_id', usuario_id);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logger.error('Erro ao listar relatórios:', error);
      throw error;
    }
  },

  async criar(dados: Omit<Relatorio, 'id' | 'created_at' | 'status'>): Promise<Relatorio> {
    try {
      const { data, error } = await supabase.from('relatorios').insert({ ...dados, status: 'pendente' }).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar relatório:', error);
      throw error;
    }
  },

  async obter(id: string): Promise<Relatorio | null> {
    try {
      const { data, error } = await supabase.from('relatorios').select(RELATORIO_FIELDS).eq('id', id).single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao obter relatório:', error);
      throw error;
    }
  },

  async excluir(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('relatorios').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      logger.error('Erro ao excluir relatório:', error);
      throw error;
    }
  },
};

export default relatoriosService;
