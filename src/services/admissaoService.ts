// @ts-nocheck
// V17-S002: AdmissaoService Real - Workflow Completo
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export type StatusAdmissao = 'rascunho' | 'documentos_pendentes' | 'aguardando_aprovacao' | 'aprovada' | 'concluida' | 'cancelada';

export interface Admissao {
  id: string; empresa_id: string; nome: string; cpf: string; email?: string;
  cargo_id?: string; departamento_id?: string; salario: number; data_admissao: string;
  tipo_contrato: string; status: StatusAdmissao; documentos?: string[];
  created_at: string; updated_at: string;
}

export const admissaoServiceReal = {
  async getAll(empresaId: string) {
    const { data, error } = await supabase.from('admissoes').select('*, cargo:cargos(nome), departamento:departamentos(nome)').eq('empresa_id', empresaId).order('created_at', { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('admissoes').select('*').eq('id', id).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async create(admissao: Partial<Admissao>) {
    const { data, error } = await supabase.from('admissoes').insert({ ...admissao, status: 'rascunho' }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async update(id: string, admissao: Partial<Admissao>) {
    const { data, error } = await supabase.from('admissoes').update({ ...admissao, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async avancarStatus(id: string, novoStatus: StatusAdmissao) {
    return this.update(id, { status: novoStatus });
  },
  async concluir(id: string) {
    const admissao = await this.getById(id);
    if (!admissao) throw new Error('Admissão não encontrada');
    const { data: colaborador, error } = await supabase.from('colaboradores').insert({
      empresa_id: admissao.empresa_id, nome: admissao.nome, cpf: admissao.cpf, email: admissao.email,
      cargo_id: admissao.cargo_id, departamento_id: admissao.departamento_id,
      salario: admissao.salario, data_admissao: admissao.data_admissao, tipo_contrato: admissao.tipo_contrato, status: 'ativo'
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    await this.update(id, { status: 'concluida' });
    return colaborador;
  },
  async cancelar(id: string, motivo?: string) {
    return this.update(id, { status: 'cancelada' });
  }
};
export default admissaoServiceReal;
