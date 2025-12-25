/**
 * @fileoverview Service para operações de colaboradores
 * @module services/colaboradoresService
 */
import { supabase } from '@/integrations/supabase/client';
import { Colaborador, ColaboradorFormData, ColaboradorFilters } from '@/types/colaborador';
import { logger } from '@/lib/logger';

const COLABORADOR_FIELDS = 'id, nome, cpf, rg, data_nascimento, sexo, estado_civil, email, telefone, celular, endereco, numero, complemento, bairro, cidade, estado, cep, cargo_id, departamento_id, data_admissao, data_demissao, salario, tipo_contrato, jornada_trabalho, banco, agencia, conta, tipo_conta, pix, status, foto_url, empresa_id, created_at, updated_at';

export const colaboradoresService = {
  async listar(filters?: ColaboradorFilters): Promise<Colaborador[]> {
    try {
      let query = supabase.from('colaboradores').select(COLABORADOR_FIELDS);
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.departamento_id) {
        query = query.eq('departamento_id', filters.departamento_id);
      }
      if (filters?.search) {
        query = query.or(`nome.ilike.%${filters.search}%,cpf.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query.order('nome');
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logger.error('Erro ao listar colaboradores:', error);
      throw error;
    }
  },

  async buscarPorId(id: string): Promise<Colaborador | null> {
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .select(COLABORADOR_FIELDS)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar colaborador por ID:', error);
      throw error;
    }
  },

  async criar(dados: ColaboradorFormData): Promise<Colaborador> {
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .insert(dados)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar colaborador:', error);
      throw error;
    }
  },

  async atualizar(id: string, dados: Partial<ColaboradorFormData>): Promise<Colaborador> {
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .update(dados)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar colaborador:', error);
      throw error;
    }
  },

  async excluir(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('colaboradores')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      logger.error('Erro ao excluir colaborador:', error);
      throw error;
    }
  },

  async contarPorStatus(): Promise<Record<string, number>> {
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .select('status');
      
      if (error) throw error;
      
      return (data ?? []).reduce((acc, item) => {
        const status = item.status ?? 'ativo';
        acc[status] = (acc[status] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      logger.error('Erro ao contar colaboradores por status:', error);
      throw error;
    }
  },
};

export default colaboradoresService;
