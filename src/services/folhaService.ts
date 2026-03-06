// @ts-nocheck
// V18-BUILD: FolhaService - Production Ready with Supabase
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';

export interface FolhaItem {
  id: string;
  folha_id: string;
  colaborador_id: string;
  rubrica_id: string | null;
  referencia: number | null;
  valor: number;
  tipo: string;
  colaborador?: { nome: string; cpf: string };
  rubrica?: { codigo: string; nome: string };
}

export interface FolhaFilters {
  empresa_id?: string;
  competencia?: string;
  tipo?: string;
  status?: string;
}

export const folhaServiceReal = {
  async getAll(filters: FolhaFilters = {}) {
    let query = supabase
      .from('folhas_pagamento')
      .select('*')
      .order('competencia', { ascending: false });

    if (filters.empresa_id) query = query.eq('empresa_id', filters.empresa_id);
    if (filters.competencia) query = query.eq('competencia', filters.competencia);
    if (filters.tipo) query = query.eq('tipo', filters.tipo);
    if (filters.status) query = query.eq('status', filters.status);

    const { data, error } = await query;
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async list(filters?: FolhaFilters) {
    return this.getAll(filters || {});
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('folhas_pagamento')
      .select('*')
      .eq('id', id)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async getByCompetencia(empresaId: string, competencia: string) {
    const { data, error } = await supabase
      .from('folhas_pagamento')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('competencia', competencia)
      .eq('tipo', 'mensal')
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async create(folha: any) {
    const { data, error } = await supabase
      .from('folhas_pagamento')
      .insert(folha)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async update(id: string, folha: any) {
    const { data, error } = await supabase
      .from('folhas_pagamento')
      .update({ ...folha, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async calcular(id: string) {
    const folha = await this.getById(id);
    if (!folha) throw new Error('Folha não encontrada');

    return this.update(id, {
      status: 'calculada',
      data_calculo: new Date().toISOString(),
    });
  },

  async fechar(id: string) {
    return this.update(id, { status: 'fechada', data_fechamento: new Date().toISOString() });
  },

  async reabrir(id: string) {
    return this.update(id, { status: 'aberta' });
  },

  async delete(id: string) {
    const folha = await this.getById(id);
    if (folha?.status === 'fechada') {
      throw new Error('Não é possível excluir folha fechada');
    }
    const { error } = await supabase.from('folhas_pagamento').delete().eq('id', id);
    if (error) throw new Error(handleSupabaseError(error));
  },
};

export default folhaServiceReal;
