// V15-390
import { supabase } from '@/integrations/supabase/client';
export interface Feriado { id: string; empresa_id?: string; data: string; nome: string; tipo: 'nacional' | 'estadual' | 'municipal' | 'facultativo'; }
export const feriadoService = {
  async list(empresaId?: string, ano?: number) { let query = supabase.from('feriados').select('*').order('data'); if (empresaId) query = query.or(`empresa_id.eq.${empresaId},empresa_id.is.null`); if (ano) query = query.gte('data', `${ano}-01-01`).lte('data', `${ano}-12-31`); const { data, error } = await query; if (error) throw error; return data as Feriado[]; },
  async create(feriado: Omit<Feriado, 'id'>) { const { data, error } = await supabase.from('feriados').insert(feriado).select().single(); if (error) throw error; return data as Feriado; },
  async update(id: string, feriado: Partial<Feriado>) { const { data, error } = await supabase.from('feriados').update(feriado).eq('id', id).select().single(); if (error) throw error; return data as Feriado; },
  async delete(id: string) { const { error } = await supabase.from('feriados').delete().eq('id', id); if (error) throw error; },
};
