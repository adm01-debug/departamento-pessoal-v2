/**
 * @fileoverview Service para operações de desligamento
 * @module services/desligamentoService
 * @version V8.2 - QA Fix - Tipagem corrigida, logger adicionado
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { Desligamento, StatusDesligamento, TipoDesligamento, CalculoRescisao } from '@/types/desligamento';

// ============================================
// TIPOS PARA CRIAÇÃO/ATUALIZAÇÃO
// ============================================

export type DesligamentoCreate = Omit<Desligamento, 'id' | 'created_at' | 'updated_at'>;
export type DesligamentoUpdate = Partial<Omit<Desligamento, 'id' | 'created_at' | 'updated_at' | 'colaborador_id'>>;

// ============================================
// FILTROS
// ============================================

export interface DesligamentoFilters {
  empresa_id?: string;
  colaborador_id?: string;
  status?: StatusDesligamento;
  tipo?: TipoDesligamento;
  data_inicio?: string;
  data_fim?: string;
}

// ============================================
// SERVICE
// ============================================

export const desligamentoService = {
  /**
   * Listar todos os desligamentos com filtros opcionais
   */
  async getAll(filters?: DesligamentoFilters): Promise<Desligamento[]> {
    try {
      let query = supabase
        .from('desligamentos')
        .select(`
          id,
          colaborador_id,
          empresa_id,
          tipo,
          status,
          data_desligamento,
          data_aviso_previo,
          aviso_previo_trabalhado,
          dias_aviso_previo,
          motivo_detalhado,
          checklist_comunicacao,
          checklist_documentacao,
          checklist_calculo_rescisao,
          checklist_homologacao,
          checklist_revogacao_acessos,
          checklist_devolucao_equipamentos,
          checklist_esocial,
          checklist_pagamento,
          entrevista_realizada,
          entrevista_observacoes,
          documentos_gerados,
          observacoes,
          created_at,
          updated_at
        `);
      
      if (filters?.empresa_id) {
        query = query.eq('empresa_id', filters.empresa_id);
      }
      if (filters?.colaborador_id) {
        query = query.eq('colaborador_id', filters.colaborador_id);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.tipo) {
        query = query.eq('tipo', filters.tipo);
      }
      if (filters?.data_inicio) {
        query = query.gte('data_desligamento', filters.data_inicio);
      }
      if (filters?.data_fim) {
        query = query.lte('data_desligamento', filters.data_fim);
      }
      
      const { data, error } = await query.order('data_desligamento', { ascending: false });
      
      if (error) throw error;
      return (data ?? []) as Desligamento[];
    } catch (error) {
      logger.error('Erro ao listar desligamentos:', error);
      throw error;
    }
  },

  /**
   * Buscar desligamento por ID
   */
  async getById(id: string): Promise<Desligamento | null> {
    try {
      const { data, error } = await supabase
        .from('desligamentos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return data as Desligamento;
    } catch (error) {
      logger.error('Erro ao buscar desligamento:', { id, error });
      throw error;
    }
  },

  /**
   * Buscar desligamento pelo colaborador
   */
  async getByColaborador(colaboradorId: string): Promise<Desligamento | null> {
    try {
      const { data, error } = await supabase
        .from('desligamentos')
        .select('*')
        .eq('colaborador_id', colaboradorId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return data as Desligamento;
    } catch (error) {
      logger.error('Erro ao buscar desligamento do colaborador:', { colaboradorId, error });
      throw error;
    }
  },

  /**
   * Criar novo desligamento
   */
  async create(dados: DesligamentoCreate): Promise<Desligamento> {
    try {
      // Validações
      if (!dados.colaborador_id) {
        throw new Error('colaborador_id é obrigatório');
      }
      if (!dados.tipo) {
        throw new Error('tipo é obrigatório');
      }
      if (!dados.data_desligamento) {
        throw new Error('data_desligamento é obrigatória');
      }

      const { data, error } = await supabase
        .from('desligamentos')
        .insert({
          ...dados,
          status: dados.status || 'iniciado',
          checklist_comunicacao: dados.checklist_comunicacao ?? false,
          checklist_documentacao: dados.checklist_documentacao ?? false,
          checklist_calculo_rescisao: dados.checklist_calculo_rescisao ?? false,
          checklist_homologacao: dados.checklist_homologacao ?? false,
          checklist_revogacao_acessos: dados.checklist_revogacao_acessos ?? false,
          checklist_devolucao_equipamentos: dados.checklist_devolucao_equipamentos ?? false,
          checklist_esocial: dados.checklist_esocial ?? false,
          checklist_pagamento: dados.checklist_pagamento ?? false,
          entrevista_realizada: dados.entrevista_realizada ?? false,
          documentos_gerados: dados.documentos_gerados ?? [],
        })
        .select()
        .single();
      
      if (error) throw error;
      
      logger.info('Desligamento criado:', { id: data.id, colaborador_id: dados.colaborador_id });
      return data as Desligamento;
    } catch (error) {
      logger.error('Erro ao criar desligamento:', error);
      throw error;
    }
  },

  /**
   * Atualizar desligamento
   */
  async update(id: string, dados: DesligamentoUpdate): Promise<Desligamento> {
    try {
      const { data, error } = await supabase
        .from('desligamentos')
        .update(dados)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      logger.info('Desligamento atualizado:', { id });
      return data as Desligamento;
    } catch (error) {
      logger.error('Erro ao atualizar desligamento:', { id, error });
      throw error;
    }
  },

  /**
   * Atualizar status do desligamento
   */
  async updateStatus(id: string, status: StatusDesligamento): Promise<Desligamento> {
    try {
      const { data, error } = await supabase
        .from('desligamentos')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      logger.info('Status do desligamento atualizado:', { id, status });
      return data as Desligamento;
    } catch (error) {
      logger.error('Erro ao atualizar status:', { id, status, error });
      throw error;
    }
  },

  /**
   * Atualizar checklist item
   */
  async updateChecklist(id: string, item: string, valor: boolean): Promise<Desligamento> {
    try {
      const checklistItems = [
        'checklist_comunicacao',
        'checklist_documentacao',
        'checklist_calculo_rescisao',
        'checklist_homologacao',
        'checklist_revogacao_acessos',
        'checklist_devolucao_equipamentos',
        'checklist_esocial',
        'checklist_pagamento',
      ];

      if (!checklistItems.includes(item)) {
        throw new Error(`Item de checklist inválido: ${item}`);
      }

      const { data, error } = await supabase
        .from('desligamentos')
        .update({ [item]: valor })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Desligamento;
    } catch (error) {
      logger.error('Erro ao atualizar checklist:', { id, item, error });
      throw error;
    }
  },

  /**
   * Salvar cálculo de rescisão
   */
  async saveCalculo(id: string, calculo: CalculoRescisao): Promise<Desligamento> {
    try {
      const { data, error } = await supabase
        .from('desligamentos')
        .update({ 
          calculo,
          checklist_calculo_rescisao: true 
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      logger.info('Cálculo de rescisão salvo:', { id });
      return data as Desligamento;
    } catch (error) {
      logger.error('Erro ao salvar cálculo:', { id, error });
      throw error;
    }
  },

  /**
   * Excluir desligamento (soft delete via status)
   */
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('desligamentos')
        .update({ status: 'cancelado' })
        .eq('id', id);
      
      if (error) throw error;
      
      logger.info('Desligamento cancelado:', { id });
    } catch (error) {
      logger.error('Erro ao cancelar desligamento:', { id, error });
      throw error;
    }
  },

  /**
   * Estatísticas de desligamentos
   */
  async getEstatisticas(empresaId?: string, ano?: number): Promise<{
    total: number;
    porTipo: Record<TipoDesligamento, number>;
    porMes: { mes: string; total: number }[];
  }> {
    try {
      const anoAtual = ano || new Date().getFullYear();
      
      let query = supabase
        .from('desligamentos')
        .select('tipo, data_desligamento')
        .gte('data_desligamento', `${anoAtual}-01-01`)
        .lte('data_desligamento', `${anoAtual}-12-31`);
      
      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      const registros = data ?? [];
      
      // Contagem por tipo
      const porTipo: Record<string, number> = {};
      const porMesMap: Record<string, number> = {};
      
      registros.forEach(r => {
        // Por tipo
        porTipo[r.tipo] = (porTipo[r.tipo] || 0) + 1;
        
        // Por mês
        const mes = r.data_desligamento.substring(0, 7);
        porMesMap[mes] = (porMesMap[mes] || 0) + 1;
      });
      
      const porMes = Object.entries(porMesMap)
        .map(([mes, total]) => ({ mes, total }))
        .sort((a, b) => a.mes.localeCompare(b.mes));
      
      return {
        total: registros.length,
        porTipo: porTipo as Record<TipoDesligamento, number>,
        porMes,
      };
    } catch (error) {
      logger.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  },
};

export default desligamentoService;
