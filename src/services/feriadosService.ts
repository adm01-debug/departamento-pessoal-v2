import { supabase } from '@/integrations/supabase/client';

export interface Feriado {
  id: string;
  data: string;
  nome: string;
  tipo: 'nacional' | 'estadual' | 'municipal' | 'ponto_facultativo';
  uf?: string;
  cidade?: string;
}

export const feriadosService = {
  async listar(ano?: number, uf?: string): Promise<Feriado[]> {
    let query = supabase.from('feriados').select('id, data, nome, tipo, uf');
    if (ano) {
      query = query.gte('data', `${ano}-01-01`).lte('data', `${ano}-12-31`);
    }
    if (uf) query = query.or(`uf.is.null,uf.eq.${uf}`);
    const { data, error } = await query.order('data');
    if (error) throw error;
    return data ?? [];
  },

  async criar(dados: Omit<Feriado, 'id'>): Promise<Feriado> {
    const { data, error } = await supabase.from('feriados').insert(dados).select().single();
    if (error) throw error;
    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase.from('feriados').delete().eq('id', id);
    if (error) throw error;
  },

  async isFeriado(data: string, uf?: string): Promise<boolean> {
    const feriados = await this.listar(undefined, uf);
    return feriados.some(f => f.data === data);
  },
};

export default feriadosService;
