// @ts-nocheck
/**
 * @fileoverview Service para assinaturas digitais
 * @module services/assinaturasService
 */
import { supabase } from '@/integrations/supabase/client';

export interface AssinaturaDigital {
  id: string;
  documentoId: string;
  usuarioId: string;
  tipo: 'eletronica' | 'digital' | 'manuscrita';
  imagemAssinatura?: string;
  certificado?: string;
  ipOrigem: string;
  dataAssinatura: string;
  hash: string;
}

export const assinaturasService = {
  async assinar(documentoId: string, dados: { tipo: string; imagem?: string }): Promise<AssinaturaDigital> {
    const { data, error } = await supabase.from('assinaturas').insert({ documento_id: documentoId, ...dados }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async verificar(assinaturaId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('verificar_assinatura', { assinatura_id: assinaturaId });
    if (error) throw new Error(error.message);
    return data;
  },

  async listarPorDocumento(documentoId: string): Promise<AssinaturaDigital[]> {
    const { data, error } = await supabase.from('assinaturas').select('*').eq('documento_id', documentoId).order('created_at');
    if (error) throw new Error(error.message);
    return data || [];
  },

  async salvarAssinaturaManuscrita(usuarioId: string, imagemBase64: string): Promise<void> {
    const { error } = await supabase.from('assinaturas_salvas').upsert({ usuario_id: usuarioId, imagem: imagemBase64 });
    if (error) throw new Error(error.message);
  },

  async buscarAssinaturaSalva(usuarioId: string): Promise<string | null> {
    const { data, error } = await supabase.from('assinaturas_salvas').select('imagem').eq('usuario_id', usuarioId).single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data?.imagem || null;
  },
};
