// V17-S003: DemissaoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export type TipoDemissao = 'sem_justa_causa' | 'justa_causa' | 'pedido_demissao' | 'acordo' | 'termino_contrato' | 'falecimento';

export interface Demissao {
  id: string; empresa_id: string; colaborador_id: string; tipo: TipoDemissao;
  data_demissao: string; data_aviso?: string; aviso_trabalhado: boolean;
  motivo?: string; status: string; created_at: string; updated_at: string;
}

export const demissaoServiceReal = {
  async getAll(empresaId: string) {
    const { data, error } = await supabase.from('demissoes').select('*, colaborador:colaboradores(id, nome, cpf)').eq('empresa_id', empresaId).order('data_demissao', { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  async getById(id: string) {
    const { data, error } = await supabase.from('demissoes').select('*, colaborador:colaboradores(*)').eq('id', id).single();
    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async create(demissao: Partial<Demissao>) {
    const { data, error } = await supabase.from('demissoes').insert({ ...demissao, status: 'em_andamento' }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async update(id: string, demissao: Partial<Demissao>) {
    const { data, error } = await supabase.from('demissoes').update({ ...demissao, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async concluir(id: string) {
    const demissao = await this.getById(id);
    if (!demissao) throw new Error('Demissão não encontrada');
    await supabase.from('colaboradores').update({ status: 'desligado', data_demissao: demissao.data_demissao }).eq('id', demissao.colaborador_id);
    return this.update(id, { status: 'concluida' });
  }
};
export default demissaoServiceReal;
