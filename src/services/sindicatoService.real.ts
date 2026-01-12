// V17-S014: SindicatoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export interface Sindicato { id: string; empresa_id: string; nome: string; cnpj: string; codigo_sindical?: string; data_base?: string; contribuicao_percentual?: number; }
export const sindicatoServiceReal = {
  async getAll(empresaId: string) { const { data, error } = await supabase.from('sindicatos').select('*').eq('empresa_id', empresaId); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async create(sindicato: Partial<Sindicato>) { const { data, error } = await supabase.from('sindicatos').insert(sindicato).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  async update(id: string, sindicato: Partial<Sindicato>) { const { data, error } = await supabase.from('sindicatos').update(sindicato).eq('id', id).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; }
}; export default sindicatoServiceReal;
