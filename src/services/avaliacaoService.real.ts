// V20-SE007: avaliacaoService Expandido
import { supabase } from '@/integrations/supabase/client';

export class avaliacaoServiceExpanded {
  async listar(filtros?: Record<string, any>) {
    const { data, error } = await supabase.from('avaliacaos').select('*');
    if (error) throw error;
    return data || [];
  }

  async buscarPorId(id: string) {
    const { data, error } = await supabase.from('avaliacaos').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async criar(dados: Record<string, any>) {
    const { data, error } = await supabase.from('avaliacaos').insert(dados).select().single();
    if (error) throw error;
    return data;
  }

  async atualizar(id: string, dados: Record<string, any>) {
    const { data, error } = await supabase.from('avaliacaos').update(dados).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async excluir(id: string) {
    const { error } = await supabase.from('avaliacaos').delete().eq('id', id);
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
    return formato === 'json' ? JSON.stringify(dados) : dados.map(d => Object.values(d).join(',')).join('\n');
  }
}

export const avaliacaoServiceReal = new avaliacaoServiceExpanded();
export default avaliacaoServiceReal;
