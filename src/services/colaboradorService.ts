// @ts-nocheck
// V18-FIX: ColaboradorService - Production Ready with Supabase
// Atualizado em 16/01/2026 - Adicionado método list para compatibilidade
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import type { Colaborador, Insertable, Updatable } from '@/integrations/supabase/database.types';

export interface ColaboradorFilters {
  empresa_id?: string;
  status?: string;
  departamento_id?: string;
  cargo_id?: string;
  search?: string;
}

export interface ColaboradorWithRelations extends Colaborador {
  cargo?: { id: string; nome: string } | null;
  departamento?: { id: string; nome: string } | null;
  dependentes?: Array<{ id: string; nome: string; parentesco: string }>;
}

export const colaboradorServiceReal = {
  async getAll(filters: ColaboradorFilters = {}): Promise<ColaboradorWithRelations[]> {
    let query = supabase
      .from('colaboradores')
      .select(`
        *,
        cargo:cargos(id, nome),
        departamento:departamentos(id, nome)
      `)
      .order('nome');

    if (filters.empresa_id) query = query.eq('empresa_id', filters.empresa_id);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.departamento_id) query = query.eq('departamento_id', filters.departamento_id);
    if (filters.cargo_id) query = query.eq('cargo_id', filters.cargo_id);
    if (filters.search) {
      query = query.or(`nome.ilike.%${filters.search}%,cpf.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  // Alias para compatibilidade com ColaboradoresPage
  async list(filters?: ColaboradorFilters): Promise<ColaboradorWithRelations[]> {
    return this.getAll(filters || {});
  },

  async getById(id: string): Promise<ColaboradorWithRelations | null> {
    const { data, error } = await supabase
      .from('colaboradores')
      .select(`
        *,
        cargo:cargos(*),
        departamento:departamentos(*),
        dependentes(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(handleSupabaseError(error));
    }
    return data;
  },

  async getByCpf(cpf: string): Promise<Colaborador | null> {
    const cleanCpf = cpf.replace(/\D/g, '');
    const { data, error } = await supabase
      .from('colaboradores')
      .select('*')
      .eq('cpf', cleanCpf)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(handleSupabaseError(error));
    }
    return data;
  },

  async create(colaborador: Insertable<'colaboradores'>): Promise<Colaborador> {
    const { data, error } = await supabase
      .from('colaboradores')
      .insert({
        ...colaborador,
        cpf: colaborador.cpf.replace(/\D/g, ''),
      })
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async update(id: string, colaborador: Updatable<'colaboradores'>): Promise<Colaborador> {
    const updateData: Updatable<'colaboradores'> = {
      ...colaborador,
      updated_at: new Date().toISOString(),
    };
    if (colaborador.cpf) {
      updateData.cpf = colaborador.cpf.replace(/\D/g, '');
    }

    const { data, error } = await supabase
      .from('colaboradores')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('colaboradores')
      .delete()
      .eq('id', id);

    if (error) throw new Error(handleSupabaseError(error));
  },

  async getAtivos(empresaId: string): Promise<Colaborador[]> {
    return this.getAll({ empresa_id: empresaId, status: 'ativo' });
  },

  async getByDepartamento(departamentoId: string): Promise<Colaborador[]> {
    return this.getAll({ departamento_id: departamentoId });
  },

  async countByStatus(empresaId: string): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('colaboradores')
      .select('status')
      .eq('empresa_id', empresaId);

    if (error) throw new Error(handleSupabaseError(error));

    return (data || []).reduce((acc, { status }) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },

  async getAniversariantes(empresaId: string, mes: number): Promise<Colaborador[]> {
    const { data, error } = await supabase
      .from('colaboradores')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('status', 'ativo');

    if (error) throw new Error(handleSupabaseError(error));

    return (data || []).filter(c => {
      if (!c.data_nascimento) return false;
      const mesNascimento = new Date(c.data_nascimento).getMonth() + 1;
      return mesNascimento === mes;
    });
  },
};

export default colaboradorServiceReal;
