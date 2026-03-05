// @ts-nocheck
// V17-S007: DocumentoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export type TipoDocumento = 'rg' | 'cpf' | 'cnh' | 'ctps' | 'titulo_eleitor' | 'reservista' | 'comprovante_residencia' | 'certidao' | 'diploma' | 'aso' | 'contrato' | 'outro';

export interface Documento {
  id: string; colaborador_id: string; tipo: TipoDocumento; nome: string;
  url: string; data_validade?: string; validado: boolean; validado_por?: string;
  created_at: string; updated_at: string;
}

export const documentoServiceReal = {
  async getByColaborador(colaboradorId: string) {
    const { data, error } = await supabase.from('documentos').select('*').eq('colaborador_id', colaboradorId).order('created_at', { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async upload(colaboradorId: string, file: File, tipo: TipoDocumento) {
    const fileName = `${colaboradorId}/${tipo}_${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('documentos').upload(fileName, file);
    if (uploadError) throw new Error(uploadError.message);
    const { data: urlData } = supabase.storage.from('documentos').getPublicUrl(fileName);
    const { data, error } = await supabase.from('documentos').insert({ colaborador_id: colaboradorId, tipo, nome: file.name, url: urlData.publicUrl, validado: false }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async delete(id: string) {
    const doc = await this.getById(id);
    if (doc?.url) { const path = doc.url.split('/').slice(-2).join('/'); await supabase.storage.from('documentos').remove([path]); }
    const { error } = await supabase.from('documentos').delete().eq('id', id);
    if (error) throw new Error(handleSupabaseError(error));
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('documentos').select('*').eq('id', id).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async validar(id: string, usuarioId: string) {
    const { data, error } = await supabase.from('documentos').update({ validado: true, validado_por: usuarioId, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async getVencendo(empresaId: string, dias: number = 30) {
    const dataLimite = new Date(); dataLimite.setDate(dataLimite.getDate() + dias);
    const { data, error } = await supabase.from('documentos').select('*, colaborador:colaboradores!inner(id, nome, empresa_id)').not('data_validade', 'is', null).lte('data_validade', dataLimite.toISOString().split('T')[0]).eq('colaborador.empresa_id', empresaId);
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  }
};
export default documentoServiceReal;
