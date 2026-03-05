// @ts-nocheck
// V17-S010: RubricaService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export type TipoRubrica = 'provento' | 'desconto' | 'informativo';
export type IncidenciaTributaria = 'INSS' | 'IRRF' | 'FGTS' | 'nenhuma';

export interface Rubrica {
  id: string; empresa_id: string; codigo: string; nome: string; tipo: TipoRubrica;
  codigo_esocial?: string; incidencia_inss: boolean; incidencia_irrf: boolean;
  incidencia_fgts: boolean; ativa: boolean; created_at: string; updated_at: string;
}

export const rubricaServiceReal = {
  async getAll(empresaId: string) {
    const { data, error } = await supabase.from('rubricas').select('*').eq('empresa_id', empresaId).order('codigo');
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('rubricas').select('*').eq('id', id).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async getByCodigo(empresaId: string, codigo: string) {
    const { data, error } = await supabase.from('rubricas').select('*').eq('empresa_id', empresaId).eq('codigo', codigo).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async create(rubrica: Partial<Rubrica>) {
    const { data, error } = await supabase.from('rubricas').insert({ ...rubrica, ativa: true }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async update(id: string, rubrica: Partial<Rubrica>) {
    const { data, error } = await supabase.from('rubricas').update({ ...rubrica, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async getProventos(empresaId: string) {
    const { data, error } = await supabase.from('rubricas').select('*').eq('empresa_id', empresaId).eq('tipo', 'provento').eq('ativa', true);
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getDescontos(empresaId: string) {
    const { data, error } = await supabase.from('rubricas').select('*').eq('empresa_id', empresaId).eq('tipo', 'desconto').eq('ativa', true);
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  }
};
export default rubricaServiceReal;
