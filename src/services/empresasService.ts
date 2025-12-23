import { supabase } from '@/integrations/supabase/client';
import { Empresa, EmpresaFormData, EmpresaFilters } from '@/types/empresa';

export const empresasService = {
  async listar(filters?: EmpresaFilters): Promise<Empresa[]> {
    let query = supabase.from('empresas').select('id, razao_social, cnpj, ativa');
    if (filters?.ativa !== undefined) query = query.eq('ativa', filters.ativa);
    if (filters?.search) query = query.or(`razao_social.ilike.%${filters.search}%,cnpj.ilike.%${filters.search}%`);
    const { data, error } = await query.order('razao_social');
    if (error) throw error;
    return data ?? [];
  },

  async buscarPorId(id: string): Promise<Empresa | null> {
    const { data, error } = await supabase.from('empresas').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  async criar(dados: EmpresaFormData): Promise<Empresa> {
    const { data, error } = await supabase.from('empresas').insert(dados).select().single();
    if (error) throw error;
    return data;
  },

  async atualizar(id: string, dados: Partial<EmpresaFormData>): Promise<Empresa> {
    const { data, error } = await supabase.from('empresas').update(dados).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async ativar(id: string): Promise<void> {
    const { error } = await supabase.from('empresas').update({ ativa: true }).eq('id', id);
    if (error) throw error;
  },

  async desativar(id: string): Promise<void> {
    const { error } = await supabase.from('empresas').update({ ativa: false }).eq('id', id);
    if (error) throw error;
  },
};

export default empresasService;
