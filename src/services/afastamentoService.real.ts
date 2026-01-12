// V17-S001: AfastamentoService Real - Supabase
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export interface Afastamento {
  id: string; empresa_id: string; colaborador_id: string; tipo: string;
  cid?: string; data_inicio: string; data_fim?: string; dias_afastados?: number;
  atestado_url?: string; observacoes?: string; status: string;
  created_at: string; updated_at: string;
}

export const afastamentoServiceReal = {
  async getAll(empresaId: string) {
    const { data, error } = await supabase.from('afastamentos').select('*, colaborador:colaboradores(id, nome, cpf)').eq('empresa_id', empresaId).order('data_inicio', { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('afastamentos').select('*, colaborador:colaboradores(id, nome)').eq('id', id).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async create(afastamento: Partial<Afastamento>) {
    if (afastamento.data_fim && afastamento.data_inicio) {
      const d1 = new Date(afastamento.data_inicio), d2 = new Date(afastamento.data_fim);
      afastamento.dias_afastados = Math.ceil((d2.getTime() - d1.getTime()) / 86400000) + 1;
    }
    const { data, error } = await supabase.from('afastamentos').insert(afastamento).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async update(id: string, afastamento: Partial<Afastamento>) {
    const { data, error } = await supabase.from('afastamentos').update({ ...afastamento, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase.from('afastamentos').update({ status: 'cancelado' }).eq('id', id);
    if (error) throw new Error(handleSupabaseError(error));
  },
  async encerrar(id: string, dataFim: string) {
    return this.update(id, { data_fim: dataFim, status: 'encerrado' });
  },
  async getAtivos(empresaId: string) {
    const { data, error } = await supabase.from('afastamentos').select('*, colaborador:colaboradores(id, nome)').eq('empresa_id', empresaId).eq('status', 'ativo');
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  }
};
export default afastamentoServiceReal;
