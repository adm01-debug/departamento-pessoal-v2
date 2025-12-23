import { supabase } from '@/integrations/supabase/client';

export interface Relatorio {
  id: string;
  tipo: string;
  nome: string;
  parametros?: Record<string, unknown>;
  formato?: 'pdf' | 'xlsx' | 'csv';
  status: 'pendente' | 'processando' | 'concluido' | 'erro';
  url?: string;
  created_at: string;
  usuario_id: string;
}

export const relatoriosService = {
  async listar(usuario_id?: string): Promise<Relatorio[]> {
    let query = supabase.from('relatorios').select('id, tipo, nome, status, created_at');
    if (usuario_id) query = query.eq('usuario_id', usuario_id);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async criar(dados: Omit<Relatorio, 'id' | 'created_at' | 'status'>): Promise<Relatorio> {
    const { data, error } = await supabase.from('relatorios').insert({ ...dados, status: 'pendente' }).select().single();
    if (error) throw error;
    return data;
  },

  async obter(id: string): Promise<Relatorio | null> {
    const { data, error } = await supabase.from('relatorios').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async excluir(id: string): Promise<void> {
    const { error } = await supabase.from('relatorios').delete().eq('id', id);
    if (error) throw error;
  },
};

export default relatoriosService;
