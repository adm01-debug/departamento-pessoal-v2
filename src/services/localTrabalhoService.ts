import { supabase } from '@/integrations/supabase/client';
export const localTrabalhoService = {
  async listar(options: { 
    empresaId?: string; 
    search?: string; 
    page?: number; 
    pageSize?: number;
  } = {}): Promise<{ data: any[], total: number }> {
    const { empresaId, search, page = 1, pageSize = 100 } = options;
    
    let query = supabase.from('locais_trabalho').select('*', { count: 'exact' });
    
    if (empresaId) query = query.eq('empresa_id', empresaId);
    if (search) query = query.ilike('nome', `%${search}%`);
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    const { data, count, error } = await query
      .order('nome', { ascending: true })
      .range(from, to);
      
    if (error) throw error;
    return { data: (data as any[]) || [], total: count || 0 };
  },
  
  async criar(d: any): Promise<any> {
    
    const { data, error } = await supabase.from('locais_trabalho').insert(d).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de local de trabalho foi retornado.');
    return data;
  
  },
  
  async atualizar(id: string, d: any): Promise<any> {
    
    const { data, error } = await supabase.from('locais_trabalho').update(d).eq('id', id).select().maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Nenhum registro de local de trabalho foi retornado.');
    return data;
  
  },
  
  async excluir(id: string): Promise<void> {
    
    const { error } = await supabase.from('locais_trabalho').delete().eq('id', id);
    if (error) throw error;
  
  },
};

