// @ts-nocheck
// V17-S005: ContratoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export type TipoContrato = 'indeterminado' | 'determinado' | 'experiencia' | 'temporario' | 'intermitente' | 'estagio' | 'aprendiz';

export interface Contrato {
  id: string; empresa_id: string; colaborador_id: string; tipo: TipoContrato;
  data_inicio: string; data_fim?: string; salario: number; carga_horaria: number;
  status: string; created_at: string; updated_at: string;
}

export const contratoServiceReal = {
  async getAll(empresaId: string) {
    const { data, error } = await supabase.from('contratos').select('*, colaborador:colaboradores(id, nome)').eq('empresa_id', empresaId).order('data_inicio', { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getByColaborador(colaboradorId: string) {
    const { data, error } = await supabase.from('contratos').select('*').eq('colaborador_id', colaboradorId).order('data_inicio', { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('contratos').select('*').eq('id', id).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async create(contrato: Partial<Contrato>) {
    const { data, error } = await supabase.from('contratos').insert({ ...contrato, status: 'ativo' }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async update(id: string, contrato: Partial<Contrato>) {
    const { data, error } = await supabase.from('contratos').update({ ...contrato, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async renovar(id: string, novaDataFim: string) {
    return this.update(id, { data_fim: novaDataFim });
  },
  async encerrar(id: string) {
    return this.update(id, { status: 'encerrado' });
  },
  async getVencendo(empresaId: string, dias: number = 30) {
    const dataLimite = new Date(); dataLimite.setDate(dataLimite.getDate() + dias);
    const { data, error } = await supabase.from('contratos').select('*, colaborador:colaboradores(id, nome)').eq('empresa_id', empresaId).eq('status', 'ativo').not('data_fim', 'is', null).lte('data_fim', dataLimite.toISOString().split('T')[0]);
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  }
};
export default contratoServiceReal;
