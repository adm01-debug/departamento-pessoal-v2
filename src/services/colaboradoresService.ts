import { supabase } from '@/integrations/supabase/client';
import { Colaborador, ColaboradorFormData, ColaboradorFilters } from '@/types/colaborador';

export const colaboradoresService = {
  async listar(filters?: ColaboradorFilters): Promise<Colaborador[]> {
    let query = supabase.from('colaboradores').select('*');
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.departamento_id) {
      query = query.eq('departamento_id', filters.departamento_id);
    }
    if (filters?.search) {
      query = query.or(`nome.ilike.%${filters.search}%,cpf.ilike.%${filters.search}%`);
    }
    
    const { data, error } = await query.order('nome');
    if (error) throw error;
    return data ?? [];
  },

  async buscarPorId(id: string): Promise<Colaborador | null> {
    const { data, error } = await supabase
      .from('colaboradores')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async criar(dados: ColaboradorFormData): Promise<Colaborador> {
    const { data, error } = await supabase
      .from('colaboradores')
      .insert(dados)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async atualizar(id: string, dados: Partial<ColaboradorFormData>): Promise<Colaborador> {
    const { data, error } = await supabase
      .from('colaboradores')
      .update(dados)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase
      .from('colaboradores')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async contarPorStatus(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('colaboradores')
      .select('status');
    
    if (error) throw error;
    
    return (data ?? []).reduce((acc, item) => {
      const status = item.status ?? 'ativo';
      acc[status] = (acc[status] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },
};

export default colaboradoresService;

