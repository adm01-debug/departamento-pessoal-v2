// V17-S006: DependenteService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import { calcularSalarioFamilia } from '@/calculators/salarioFamilia';

export type TipoDependente = 'conjuge' | 'filho' | 'enteado' | 'pai_mae' | 'outro';

export interface Dependente {
  id: string; colaborador_id: string; nome: string; cpf?: string; data_nascimento: string;
  tipo: TipoDependente; grau_parentesco: string; ir: boolean; salario_familia: boolean;
  plano_saude: boolean; created_at: string; updated_at: string;
}

export const dependenteServiceReal = {
  async getByColaborador(colaboradorId: string) {
    const { data, error } = await supabase.from('dependentes').select('*').eq('colaborador_id', colaboradorId).order('nome');
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('dependentes').select('*').eq('id', id).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async create(dependente: Partial<Dependente>) {
    const { data, error } = await supabase.from('dependentes').insert(dependente).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async update(id: string, dependente: Partial<Dependente>) {
    const { data, error } = await supabase.from('dependentes').update({ ...dependente, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async delete(id: string) {
    const { error } = await supabase.from('dependentes').delete().eq('id', id);
    if (error) throw new Error(handleSupabaseError(error));
  },
  async getDependentesIR(colaboradorId: string) {
    const { data, error } = await supabase.from('dependentes').select('*').eq('colaborador_id', colaboradorId).eq('ir', true);
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async calcularSalarioFamilia(colaboradorId: string, salario: number) {
    const deps = await this.getByColaborador(colaboradorId);
    const hoje = new Date();
    const filhos = deps.filter(d => d.salario_familia && new Date(d.data_nascimento) > new Date(hoje.getFullYear() - 14, hoje.getMonth(), hoje.getDate())).length;
    return calcularSalarioFamilia({ salario, filhosMenores14: filhos });
  }
};
export default dependenteServiceReal;
