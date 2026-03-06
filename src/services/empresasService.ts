// @ts-nocheck
/**
 * @fileoverview Service para operações de empresas
 * @module services/empresasService
 */
import { supabase } from '@/integrations/supabase/client';
import { Empresa, EmpresaFormData, EmpresaFilters } from '@/types/empresa';
import { logger } from '@/lib/logger';

const EMPRESA_FIELDS = 'id, razao_social, nome_fantasia, cnpj, inscricao_estadual, inscricao_municipal, endereco, numero, complemento, bairro, cidade, estado, cep, telefone, email, logo_url, ativa, created_at';

export const empresasService = {
  async listar(filters?: EmpresaFilters): Promise<Empresa[]> {
    try {
      let query = supabase.from('empresas').select('id, razao_social, nome_fantasia, cnpj, ativa');
      if (filters?.ativa !== undefined) query = query.eq('ativa', filters.ativa);
      if (filters?.search) query = query.or(`razao_social.ilike.%${filters.search}%,cnpj.ilike.%${filters.search}%`);
      const { data, error } = await query.order('razao_social');
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logger.error('Erro ao listar empresas:', error);
      throw error;
    }
  },

  async buscarPorId(id: string): Promise<Empresa | null> {
    try {
      const { data, error } = await supabase.from('empresas').select(EMPRESA_FIELDS).eq('id', id).single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao buscar empresa por ID:', error);
      throw error;
    }
  },

  async criar(dados: EmpresaFormData): Promise<Empresa> {
    try {
      const { data, error } = await supabase.from('empresas').insert(dados).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar empresa:', error);
      throw error;
    }
  },

  async atualizar(id: string, dados: Partial<EmpresaFormData>): Promise<Empresa> {
    try {
      const { data, error } = await supabase.from('empresas').update(dados).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao atualizar empresa:', error);
      throw error;
    }
  },

  async ativar(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('empresas').update({ ativa: true }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      logger.error('Erro ao ativar empresa:', error);
      throw error;
    }
  },

  async desativar(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('empresas').update({ ativa: false }).eq('id', id);
      if (error) throw error;
    } catch (error) {
      logger.error('Erro ao desativar empresa:', error);
      throw error;
    }
  },
};

export default empresasService;
