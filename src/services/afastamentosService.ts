import { supabase } from '@/integrations/supabase/client';

export interface Afastamento {
  id: string;
  colaborador_id: string;
  tipo: string;
  motivo?: string;
  data_inicio: string;
  data_fim?: string;
  status: 'ativo' | 'encerrado' | 'pendente';
  cid?: string;
  observacoes?: string;
  created_at?: string;
}

export const afastamentosService = {
  async listar(colaborador_id?: string): Promise<Afastamento[]> {
    let query = supabase.from('afastamentos').select('id, colaborador_id, tipo, data_inicio, data_fim, status, motivo');
    if (colaborador_id) query = query.eq('colaborador_id', colaborador_id);
    const { data, error } = await query.order('data_inicio', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async criar(dados: Omit<Afastamento, 'id' | 'created_at'>): Promise<Afastamento> {
    const { data, error } = await supabase.from('afastamentos').insert(dados).select().single();
    if (error) throw error;
    return data;
  },

  async encerrar(id: string, data_fim: string): Promise<Afastamento> {
    const { data, error } = await supabase.from('afastamentos').update({ status: 'encerrado', data_fim }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async ativos(): Promise<Afastamento[]> {
    const { data, error } = await supabase.from('afastamentos').select('*').eq('status', 'ativo');
    if (error) throw error;
    return data ?? [];
  },
};

export default afastamentosService;
