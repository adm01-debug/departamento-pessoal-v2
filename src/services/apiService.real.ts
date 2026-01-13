// V20-SE003: apiService Expandido
import { supabase } from '@/integrations/supabase/client';

export class apiServiceExpanded {
  async listar(filtros?: Record<string, any>) {
    const { data, error } = await supabase.from('apis').select('*');
    if (error) throw error;
    return data || [];
  }

  async buscarPorId(id: string) {
    const { data, error } = await supabase.from('apis').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async criar(dados: Record<string, any>) {
    const { data, error } = await supabase.from('apis').insert(dados).select().single();
    if (error) throw error;
    return data;
  }

  async atualizar(id: string, dados: Record<string, any>) {
    const { data, error } = await supabase.from('apis').update(dados).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async excluir(id: string) {
    const { error } = await supabase.from('apis').delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  async validar(dados: Record<string, any>) {
    const erros: string[] = [];
    if (!dados.id) erros.push('ID obrigatorio');
    return { valido: erros.length === 0, erros };
  }

  async exportar(formato: 'json' | 'csv' = 'json') {
    const dados = await this.listar();
    return formato === 'json' ? JSON.stringify(dados) : dados.map(d => Object.values(d).join(',')).join('
');
  }
}

export const apiServiceReal = new apiServiceExpanded();
export default apiServiceReal;
