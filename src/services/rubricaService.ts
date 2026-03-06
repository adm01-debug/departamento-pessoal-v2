// @ts-nocheck
// V17-S010: RubricaService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export type TipoRubrica = 'provento' | 'desconto' | 'informativo';

export interface Rubrica {
  id: string; empresa_id: string; codigo: string; nome: string; tipo: TipoRubrica;
  codigo_esocial?: string; incidencia_inss: boolean; incidencia_irrf: boolean;
  incidencia_fgts: boolean; ativo: boolean; created_at: string; updated_at: string;
}

export const rubricaServiceReal = {
  async getAll(empresaId?: string) {
    let query = supabase.from('rubricas_folha').select('*').order('codigo');
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('rubricas_folha').select('*').eq('id', id).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async getByCodigo(empresaId: string, codigo: string) {
    const { data, error } = await supabase.from('rubricas_folha').select('*').eq('empresa_id', empresaId).eq('codigo', codigo).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async create(rubrica: Partial<Rubrica>) {
    const { data, error } = await supabase.from('rubricas_folha').insert({ ...rubrica, ativo: true }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async update(id: string, rubrica: Partial<Rubrica>) {
    const { data, error } = await supabase.from('rubricas_folha').update({ ...rubrica, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async getProventos(empresaId?: string) {
    let query = supabase.from('rubricas_folha').select('*').eq('tipo', 'provento').eq('ativo', true);
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getDescontos(empresaId?: string) {
    let query = supabase.from('rubricas_folha').select('*').eq('tipo', 'desconto').eq('ativo', true);
    if (empresaId) query = query.eq('empresa_id', empresaId);
    const { data, error } = await query;
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  }
};
export default rubricaServiceReal;
