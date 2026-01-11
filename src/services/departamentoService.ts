// V15-388
import { supabase } from '@/integrations/supabase/client';
export interface Departamento { id: string; empresa_id: string; nome: string; sigla?: string; responsavel_id?: string; created_at: string; }
export const departamentoService = {
  async list(empresaId: string) { const { data, error } = await supabase.from('departamentos').select('*').eq('empresa_id', empresaId).order('nome'); if (error) throw error; return data as Departamento[]; },
  async getById(id: string) { const { data, error } = await supabase.from('departamentos').select('*').eq('id', id).single(); if (error) throw error; return data as Departamento; },
  async create(departamento: Omit<Departamento, 'id' | 'created_at'>) { const { data, error } = await supabase.from('departamentos').insert(departamento).select().single(); if (error) throw error; return data as Departamento; },
  async update(id: string, departamento: Partial<Departamento>) { const { data, error } = await supabase.from('departamentos').update(departamento).eq('id', id).select().single(); if (error) throw error; return data as Departamento; },
  async delete(id: string) { const { error } = await supabase.from('departamentos').delete().eq('id', id); if (error) throw error; },
};
