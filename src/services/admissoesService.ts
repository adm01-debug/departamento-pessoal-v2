/**
 * @fileoverview Service para gerenciamento de admissões
 * @module services/admissoesService
 * @version V8.4 - Refatorado com logger e error handling
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { Admissao, AdmissaoFormData } from '@/types/admissao';

// ============================================
// TIPOS INTERNOS
// ============================================

interface AdmissaoFilters {
  status?: string;
  empresaId?: string;
  dataInicio?: string;
  dataFim?: string;
}

interface AdmissaoStats {
  total: number;
  pendentes: number;
  emAndamento: number;
  concluidas: number;
  canceladas: number;
}

// ============================================
// SERVICE
// ============================================

export const admissoesService = {
  /**
   * Lista todas as admissões com filtros opcionais
   */
  async listar(filters?: AdmissaoFilters): Promise<Admissao[]> {
    try {
      logger.info('[AdmissoesService] Listando admissões', { filters });

      let query = supabase
        .from('admissoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.empresaId) {
        query = query.eq('empresa_id', filters.empresaId);
      }
      if (filters?.dataInicio) {
        query = query.gte('data_admissao', filters.dataInicio);
      }
      if (filters?.dataFim) {
        query = query.lte('data_admissao', filters.dataFim);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('[AdmissoesService] Erro ao listar admissões', { error });
        throw new Error(`Erro ao listar admissões: ${error.message}`);
      }

      logger.debug('[AdmissoesService] Admissões listadas', { count: data?.length ?? 0 });
      return data ?? [];
    } catch (error) {
      logger.error('[AdmissoesService] Exceção ao listar admissões', { error });
      throw error;
    }
  },

  /**
   * Busca uma admissão por ID
   */
  async buscarPorId(id: string): Promise<Admissao | null> {
    try {
      if (!id) {
        throw new Error('ID da admissão é obrigatório');
      }

      logger.info('[AdmissoesService] Buscando admissão por ID', { id });

      const { data, error } = await supabase
        .from('admissoes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          logger.warn('[AdmissoesService] Admissão não encontrada', { id });
          return null;
        }
        logger.error('[AdmissoesService] Erro ao buscar admissão', { error });
        throw new Error(`Erro ao buscar admissão: ${error.message}`);
      }

      return data;
    } catch (error) {
      logger.error('[AdmissoesService] Exceção ao buscar admissão', { error, id });
      throw error;
    }
  },

  /**
   * Cria uma nova admissão
   */
  async criar(dados: AdmissaoFormData): Promise<Admissao> {
    try {
      logger.info('[AdmissoesService] Criando nova admissão', { 
        nome: dados.nome_completo,
        cargo: dados.cargo 
      });

      // Validação básica
      if (!dados.nome_completo || !dados.cpf) {
        throw new Error('Nome e CPF são obrigatórios');
      }

      const { data, error } = await supabase
        .from('admissoes')
        .insert({
          ...dados,
          status: dados.status || 'pendente',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        logger.error('[AdmissoesService] Erro ao criar admissão', { error });
        throw new Error(`Erro ao criar admissão: ${error.message}`);
      }

      logger.info('[AdmissoesService] Admissão criada com sucesso', { id: data.id });
      return data;
    } catch (error) {
      logger.error('[AdmissoesService] Exceção ao criar admissão', { error });
      throw error;
    }
  },

  /**
   * Atualiza uma admissão existente
   */
  async atualizar(id: string, dados: Partial<AdmissaoFormData>): Promise<Admissao> {
    try {
      if (!id) {
        throw new Error('ID da admissão é obrigatório');
      }

      logger.info('[AdmissoesService] Atualizando admissão', { id, campos: Object.keys(dados) });

      const { data, error } = await supabase
        .from('admissoes')
        .update({
          ...dados,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('[AdmissoesService] Erro ao atualizar admissão', { error, id });
        throw new Error(`Erro ao atualizar admissão: ${error.message}`);
      }

      logger.info('[AdmissoesService] Admissão atualizada com sucesso', { id });
      return data;
    } catch (error) {
      logger.error('[AdmissoesService] Exceção ao atualizar admissão', { error, id });
      throw error;
    }
  },

  /**
   * Exclui uma admissão (soft delete - muda status para cancelada)
   */
  async excluir(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('ID da admissão é obrigatório');
      }

      logger.info('[AdmissoesService] Excluindo admissão (soft delete)', { id });

      const { error } = await supabase
        .from('admissoes')
        .update({ 
          status: 'cancelada',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        logger.error('[AdmissoesService] Erro ao excluir admissão', { error, id });
        throw new Error(`Erro ao excluir admissão: ${error.message}`);
      }

      logger.info('[AdmissoesService] Admissão excluída com sucesso', { id });
    } catch (error) {
      logger.error('[AdmissoesService] Exceção ao excluir admissão', { error, id });
      throw error;
    }
  },

  /**
   * Atualiza o status de uma admissão
   */
  async atualizarStatus(id: string, status: string): Promise<void> {
    try {
      if (!id || !status) {
        throw new Error('ID e status são obrigatórios');
      }

      const statusValidos = ['pendente', 'em_andamento', 'aguardando_documentos', 'concluida', 'cancelada'];
      if (!statusValidos.includes(status)) {
        throw new Error(`Status inválido: ${status}`);
      }

      logger.info('[AdmissoesService] Atualizando status da admissão', { id, status });

      const { error } = await supabase
        .from('admissoes')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        logger.error('[AdmissoesService] Erro ao atualizar status', { error, id, status });
        throw new Error(`Erro ao atualizar status: ${error.message}`);
      }

      logger.info('[AdmissoesService] Status atualizado com sucesso', { id, status });
    } catch (error) {
      logger.error('[AdmissoesService] Exceção ao atualizar status', { error, id, status });
      throw error;
    }
  },

  /**
   * Obtém estatísticas de admissões
   */
  async getEstatisticas(empresaId?: string): Promise<AdmissaoStats> {
    try {
      logger.info('[AdmissoesService] Obtendo estatísticas', { empresaId });

      let query = supabase.from('admissoes').select('status');
      
      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('[AdmissoesService] Erro ao obter estatísticas', { error });
        throw new Error(`Erro ao obter estatísticas: ${error.message}`);
      }

      const stats: AdmissaoStats = {
        total: data?.length ?? 0,
        pendentes: data?.filter(a => a.status === 'pendente').length ?? 0,
        emAndamento: data?.filter(a => a.status === 'em_andamento').length ?? 0,
        concluidas: data?.filter(a => a.status === 'concluida').length ?? 0,
        canceladas: data?.filter(a => a.status === 'cancelada').length ?? 0,
      };

      logger.debug('[AdmissoesService] Estatísticas obtidas', stats);
      return stats;
    } catch (error) {
      logger.error('[AdmissoesService] Exceção ao obter estatísticas', { error });
      throw error;
    }
  },

  /**
   * Busca admissões por CPF do candidato
   */
  async buscarPorCpf(cpf: string): Promise<Admissao[]> {
    try {
      if (!cpf) {
        throw new Error('CPF é obrigatório');
      }

      const cpfLimpo = cpf.replace(/\D/g, '');
      logger.info('[AdmissoesService] Buscando admissões por CPF', { cpf: cpfLimpo.substring(0, 3) + '***' });

      const { data, error } = await supabase
        .from('admissoes')
        .select('*')
        .eq('cpf', cpfLimpo)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('[AdmissoesService] Erro ao buscar por CPF', { error });
        throw new Error(`Erro ao buscar por CPF: ${error.message}`);
      }

      return data ?? [];
    } catch (error) {
      logger.error('[AdmissoesService] Exceção ao buscar por CPF', { error });
      throw error;
    }
  },
};

export default admissoesService;
