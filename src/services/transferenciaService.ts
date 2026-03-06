// @ts-nocheck
// V17-S020: TransferenciaService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export interface Transferencia { id: string; colaborador_id: string; departamento_anterior_id: string; departamento_novo_id: string; data_vigencia: string; motivo?: string; }
export const transferenciaServiceReal = {
  async getByColaborador(colaboradorId: string) { const { data, error } = await supabase.from('transferencias').select('*, dept_anterior:departamentos!departamento_anterior_id(nome), dept_novo:departamentos!departamento_novo_id(nome)').eq('colaborador_id', colaboradorId).order('data_vigencia', { ascending: false }); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async create(transferencia: Partial<Transferencia>) { const { data, error } = await supabase.from('transferencias').insert(transferencia).select().single(); if (error) throw new Error(handleSupabaseError(error)); await supabase.from('colaboradores').update({ departamento_id: transferencia.departamento_novo_id }).eq('id', transferencia.colaborador_id); return data; }
}; export default transferenciaServiceReal;
