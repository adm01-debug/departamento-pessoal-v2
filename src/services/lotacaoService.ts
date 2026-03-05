// @ts-nocheck
// V17-S012: LotacaoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export interface Lotacao {
  id: string; empresa_id: string; codigo: string; nome: string; tipo: number;
  fpas: string; codigo_terceiros?: string; rat: number; fap: number;
  cnae_preponderante?: string; ativa: boolean; created_at: string;
}

export const lotacaoServiceReal = {
  async getAll(empresaId: string) {
    const { data, error } = await supabase.from('lotacoes').select('*').eq('empresa_id', empresaId).order('codigo');
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('lotacoes').select('*').eq('id', id).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async create(lotacao: Partial<Lotacao>) {
    const { data, error } = await supabase.from('lotacoes').insert({ ...lotacao, ativa: true }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async update(id: string, lotacao: Partial<Lotacao>) {
    const { data, error } = await supabase.from('lotacoes').update({ ...lotacao }).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase.from('lotacoes').update({ ativa: false }).eq('id', id);
    if (error) throw new Error(handleSupabaseError(error));
  },
  async calcularEncargos(lotacaoId: string, baseCalculo: number) {
    const lot = await this.getById(lotacaoId);
    if (!lot) return null;
    const ratAjustado = lot.rat * lot.fap;
    const terceiros = parseFloat(lot.codigo_terceiros || '0');
    return { rat: Math.round(baseCalculo * (ratAjustado / 100) * 100) / 100, terceiros: Math.round(baseCalculo * (terceiros / 100) * 100) / 100 };
  }
};
export default lotacaoServiceReal;
