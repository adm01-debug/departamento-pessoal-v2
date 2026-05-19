import { supabase } from '@/integrations/supabase/client';
export const departamentoService = {
  async listar(options: { 
    search?: string; 
    page?: number; 
    pageSize?: number;
  } = {}): Promise<{ data: any[], total: number }> {
    const { search, page = 1, pageSize = 10 } = options;
    
    let query = supabase.from('departamentos').select('*', { count: 'exact' });
    
    if (search) {
      query = query.ilike('nome', `%${search}%`);
    }
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, count, error } = await query
      .order('nome', { ascending: true })
      .range(from, to);
      
    if (error) throw error;
    return { 
      data: (data as any[]) || [], 
      total: count || 0 
    };
  },
  
  async buscarPorId(id: string): Promise<any | null> {
    const { data, error } = await supabase.from('departamentos').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  
  async criar(d: any): Promise<any> {
    const { data, error } = await supabase.from('departamentos').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de departamento foi retornado.');
    return data;
  },
  
  async atualizar(id: string, d: any): Promise<any> {
    const { data, error } = await supabase.from('departamentos').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de departamento foi retornado.');
    return data;
  },
  
  async excluir(id: string): Promise<void> {
    const { error } = await supabase.from('departamentos').delete().eq('id', id);
    if (error) throw error;
  },
};

