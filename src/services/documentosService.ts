// @ts-nocheck
/**
 * @fileoverview Service para operações de documentos
 * @module services/documentosService
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface Documento {
  id: string;
  colaborador_id: string;
  tipo: 'rg' | 'cpf' | 'ctps' | 'pis' | 'titulo' | 'reservista' | 'comprovante' | 'contrato' | 'outro';
  nome: string;
  url: string;
  tamanho?: number;
  mime_type?: string;
  created_at: string;
}

export const documentosService = {
  async listar(colaborador_id: string): Promise<Documento[]> {
    try {
      const { data, error } = await supabase.from('documentos').select('id, colaborador_id, tipo, nome, url, tamanho, mime_type, created_at').eq('colaborador_id', colaborador_id).order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logger.error('Erro ao listar documentos:', error);
      throw error;
    }
  },

  async upload(colaborador_id: string, arquivo: File, tipo: Documento['tipo']): Promise<Documento> {
    try {
      const path = `${colaborador_id}/${Date.now()}_${arquivo.name}`;
      const { error: uploadError } = await supabase.storage.from('documentos').upload(path, arquivo);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('documentos').getPublicUrl(path);
      const { data, error } = await supabase.from('documentos').insert({ colaborador_id, tipo, nome: arquivo.name, url: urlData.publicUrl, tamanho: arquivo.size, mime_type: arquivo.type }).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao fazer upload de documento:', error);
      throw error;
    }
  },

  async excluir(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('documentos').delete().eq('id', id);
      if (error) throw error;
    } catch (error) {
      logger.error('Erro ao excluir documento:', error);
      throw error;
    }
  },
};

export default documentosService;
