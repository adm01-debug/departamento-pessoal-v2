import { supabase } from '@/integrations/supabase/client';

export interface Cargo {
  id: string;
  nome: string;
  departamento_id?: string;
  cbo?: string;
  salario_base?: number;
  created_at?: string;
}

export const cargosService = {
  async listar(departamento_id?: string): Promise<Cargo[]> {
    let query = supabase.from('cargos').select('id, nome, departamento_id, cbo');
    if (departamento_id) query = query.eq('departamento_id', departamento_id);
    const { data, error } = await query.order('nome');
    if (error) throw error;
    return data ?? [];
  },

  async criar(dados: Omit<Cargo, 'id' | 'created_at'>): Promise<Cargo> {
    const { data, error } = await supabase.from('cargos').insert(dados).select().single();
    if (error) throw error;
    return data;
  },

  async atualizar(id: string, dados: Partial<Cargo>): Promise<Cargo> {
    const { data, error } = await supabase.from('cargos').update(dados).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase.from('cargos').delete().eq('id', id);
    if (error) throw error;
  },
};

export default cargosService;
