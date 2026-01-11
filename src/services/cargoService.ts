// V15-389
import { supabase } from '@/integrations/supabase/client';
export interface Cargo { id: string; empresa_id: string; nome: string; cbo?: string; nivel?: string; salario_min?: number; salario_max?: number; created_at: string; }
export const cargoService = {
  async list(empresaId: string) { const { data, error } = await supabase.from('cargos').select('*').eq('empresa_id', empresaId).order('nome'); if (error) throw error; return data as Cargo[]; },
  async getById(id: string) { const { data, error } = await supabase.from('cargos').select('*').eq('id', id).single(); if (error) throw error; return data as Cargo; },
  async create(cargo: Omit<Cargo, 'id' | 'created_at'>) { const { data, error } = await supabase.from('cargos').insert(cargo).select().single(); if (error) throw error; return data as Cargo; },
  async update(id: string, cargo: Partial<Cargo>) { const { data, error } = await supabase.from('cargos').update(cargo).eq('id', id).select().single(); if (error) throw error; return data as Cargo; },
  async delete(id: string) { const { error } = await supabase.from('cargos').delete().eq('id', id); if (error) throw error; },
};
