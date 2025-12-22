import { supabase } from '@/integrations/supabase/client';
import { Ferias, FeriasFormData, FeriasFilters } from '@/types/ferias';

export const feriasService = {
  async listar(filters?: FeriasFilters): Promise<Ferias[]> {
    let query = supabase.from('ferias').select('*, colaboradores(nome)');
    
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.colaborador_id) query = query.eq('colaborador_id', filters.colaborador_id);
    if (filters?.ano) {
      query = query.gte('data_inicio', `${filters.ano}-01-01`).lte('data_inicio', `${filters.ano}-12-31`);
    }
    
    const { data, error } = await query.order('data_inicio', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async buscarPorId(id: string): Promise<Ferias | null> {
    const { data, error } = await supabase
      .from('ferias')
      .select('*, colaboradores(nome)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async criar(dados: FeriasFormData): Promise<Ferias> {
    const { data, error } = await supabase.from('ferias').insert(dados).select().single();
    if (error) throw error;
    return data;
  },

  async atualizar(id: string, dados: Partial<FeriasFormData>): Promise<Ferias> {
    const { data, error } = await supabase.from('ferias').update(dados).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async aprovar(id: string, aprovador_id: string): Promise<Ferias> {
    return this.atualizar(id, { status: 'aprovada', aprovador_id, data_aprovacao: new Date().toISOString() });
  },

  async cancelar(id: string, motivo?: string): Promise<Ferias> {
    return this.atualizar(id, { status: 'cancelada', observacoes: motivo });
  },

  async calcularDiasDisponiveis(colaborador_id: string): Promise<number> {
    const { data: colaborador } = await supabase
      .from('colaboradores')
      .select('data_admissao')
      .eq('id', colaborador_id)
      .single();
    
    if (!colaborador?.data_admissao) return 0;
    
    const admissao = new Date(colaborador.data_admissao);
    const hoje = new Date();
    const mesesTrabalhados = Math.floor((hoje.getTime() - admissao.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    return Math.min(30, Math.floor(mesesTrabalhados * 2.5));
  },
};

export default feriasService;
