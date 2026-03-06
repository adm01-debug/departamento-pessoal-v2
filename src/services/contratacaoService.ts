// @ts-nocheck
/**
 * @fileoverview Service para contratação digital
 * @module services/contratacaoService
 */
import { supabase } from '@/integrations/supabase/client';

export interface ContratacaoDigital {
  id: string;
  admissaoId: string;
  documentosEnviados: boolean;
  contratoAssinado: boolean;
  linkContrato?: string;
  dataEnvio?: string;
  dataAssinatura?: string;
  status: 'pendente' | 'enviado' | 'assinado' | 'concluido';
}

export const contratacaoService = {
  async iniciar(admissaoId: string): Promise<ContratacaoDigital> {
    const { data, error } = await supabase.from('contratacoes_digitais').insert({ admissao_id: admissaoId, status: 'pendente' }).select().single();
    if (error) throw new Error(error.message);
    return data;
  },

  async enviarDocumentos(id: string, documentos: File[]): Promise<void> {
    // Upload dos documentos
    for (const doc of documentos) {
      const { error } = await supabase.storage.from('contratacao').upload(`${id}/${doc.name}`, doc);
      if (error) throw new Error(error.message);
    }
    await supabase.from('contratacoes_digitais').update({ documentos_enviados: true, status: 'enviado' }).eq('id', id);
  },

  async gerarContrato(id: string): Promise<string> {
    const { data, error } = await supabase.rpc('gerar_contrato', { contratacao_id: id });
    if (error) throw new Error(error.message);
    return data;
  },

  async confirmarAssinatura(id: string): Promise<void> {
    const { error } = await supabase.from('contratacoes_digitais').update({ contrato_assinado: true, data_assinatura: new Date().toISOString(), status: 'assinado' }).eq('id', id);
    if (error) throw new Error(error.message);
  },

  async buscarPorAdmissao(admissaoId: string): Promise<ContratacaoDigital | null> {
    const { data, error } = await supabase.from('contratacoes_digitais').select('*').eq('admissao_id', admissaoId).single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data;
  },
};
