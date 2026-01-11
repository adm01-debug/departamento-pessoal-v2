// V16-010: EmpresaService - Production Ready with Supabase
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
import type { Empresa, Insertable, Updatable } from '@/integrations/supabase/database.types';

export interface EmpresaFilters {
  status?: string;
  uf?: string;
  regime_tributario?: string;
  search?: string;
}

export interface EmpresaStats {
  total_colaboradores: number;
  total_departamentos: number;
  total_cargos: number;
  folha_atual: number;
}

export const empresaServiceReal = {
  async getAll(filters: EmpresaFilters = {}): Promise<Empresa[]> {
    let query = supabase
      .from('empresas')
      .select('*')
      .order('razao_social');

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.uf) query = query.eq('uf', filters.uf);
    if (filters.regime_tributario) query = query.eq('regime_tributario', filters.regime_tributario);
    if (filters.search) {
      query = query.or(`razao_social.ilike.%${filters.search}%,nome_fantasia.ilike.%${filters.search}%,cnpj.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async getById(id: string): Promise<Empresa | null> {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(handleSupabaseError(error));
    }
    return data;
  },

  async getByCnpj(cnpj: string): Promise<Empresa | null> {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('cnpj', cleanCnpj)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(handleSupabaseError(error));
    }
    return data;
  },

  async create(empresa: Insertable<'empresas'>): Promise<Empresa> {
    const { data, error } = await supabase
      .from('empresas')
      .insert({
        ...empresa,
        cnpj: empresa.cnpj.replace(/\D/g, ''),
      })
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async update(id: string, empresa: Updatable<'empresas'>): Promise<Empresa> {
    const updateData: Updatable<'empresas'> = {
      ...empresa,
      updated_at: new Date().toISOString(),
    };
    if (empresa.cnpj) {
      updateData.cnpj = empresa.cnpj.replace(/\D/g, '');
    }

    const { data, error } = await supabase
      .from('empresas')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('empresas')
      .delete()
      .eq('id', id);

    if (error) throw new Error(handleSupabaseError(error));
  },

  async getStats(empresaId: string): Promise<EmpresaStats> {
    const [colaboradores, departamentos, cargos] = await Promise.all([
      supabase.from('colaboradores').select('id', { count: 'exact' }).eq('empresa_id', empresaId).eq('status', 'ativo'),
      supabase.from('departamentos').select('id', { count: 'exact' }).eq('empresa_id', empresaId).eq('ativo', true),
      supabase.from('cargos').select('id', { count: 'exact' }).eq('empresa_id', empresaId).eq('ativo', true),
    ]);

    return {
      total_colaboradores: colaboradores.count || 0,
      total_departamentos: departamentos.count || 0,
      total_cargos: cargos.count || 0,
      folha_atual: 0,
    };
  },

  async getAtivas(): Promise<Empresa[]> {
    return this.getAll({ status: 'ativa' });
  },
};

export default empresaServiceReal;
