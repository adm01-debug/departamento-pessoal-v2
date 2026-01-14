// V20: Empresa Service
import { supabase } from '@/integrations/supabase/client';

export interface Empresa {
  id: string;
  razao_social: string;
  nome_fantasia?: string | null;
  cnpj?: string | null;
  email?: string | null;
  telefone?: string | null;
  ativa?: boolean | null;
}

export const empresaService = {
  async list(): Promise<Empresa[]> {
    const { data, error } = await supabase
      .from('empresas')
      .select('id, razao_social, nome_fantasia, cnpj, email, telefone, ativa')
      .eq('ativa', true)
      .order('razao_social');
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Empresa | null> {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  },

  async create(empresa: Partial<Empresa>): Promise<Empresa> {
    const { data, error } = await supabase
      .from('empresas')
      .insert({ razao_social: empresa.razao_social || '', ...empresa })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, empresa: Partial<Empresa>): Promise<Empresa> {
    const { data, error } = await supabase
      .from('empresas')
      .update(empresa)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('empresas').delete().eq('id', id);
    if (error) throw error;
  }
};

export default empresaService;