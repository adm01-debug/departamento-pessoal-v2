// V15-213: src/services/documentoService.ts
import { supabase } from '@/integrations/supabase/client';
import type { Documento, DocumentoFormData, DocumentoFilters, EntidadeTipo } from '@/types';

export const documentoService = {
  async list(entidadeTipo: EntidadeTipo, entidadeId: string, filters?: DocumentoFilters) {
    let query = supabase.from('documentos').select('*').eq('entidade_tipo', entidadeTipo).eq('entidade_id', entidadeId).order('created_at', { ascending: false });
    if (filters?.tipo) query = query.eq('tipo', filters.tipo);
    if (filters?.search) query = query.ilike('nome', `%${filters.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return data as Documento[];
  },

  async upload(data: DocumentoFormData) {
    const fileName = `${Date.now()}_${data.arquivo.name}`;
    const filePath = `${data.entidade_tipo}/${data.entidade_id}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage.from('documentos').upload(filePath, data.arquivo);
    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('documentos').getPublicUrl(filePath);

    const doc = {
      entidade_tipo: data.entidade_tipo,
      entidade_id: data.entidade_id,
      tipo: data.tipo,
      nome: data.nome,
      descricao: data.descricao,
      arquivo_url: urlData.publicUrl,
      arquivo_nome: data.arquivo.name,
      arquivo_tamanho: data.arquivo.size,
      arquivo_tipo: data.arquivo.type,
      privado: data.privado || false,
    };

    const { data: created, error } = await supabase.from('documentos').insert(doc).select().single();
    if (error) throw error;
    return created as Documento;
  },

  async delete(id: string) {
    const { error } = await supabase.from('documentos').delete().eq('id', id);
    if (error) throw error;
  }
};
