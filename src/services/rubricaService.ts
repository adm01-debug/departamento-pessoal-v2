// V15-393
import { supabase } from '@/integrations/supabase/client';
export interface Rubrica { id: string; empresa_id: string; codigo: string; nome: string; tipo: 'provento' | 'desconto' | 'informativo'; natureza?: string; incide_inss: boolean; incide_fgts: boolean; incide_irrf: boolean; ativa: boolean; }
export const rubricaService = {
  async list(empresaId: string) { const { data, error } = await supabase.from('rubricas').select('*').eq('empresa_id', empresaId).order('codigo'); if (error) throw error; return data as Rubrica[]; },
  async getById(id: string) { const { data, error } = await supabase.from('rubricas').select('*').eq('id', id).single(); if (error) throw error; return data as Rubrica; },
  async create(rubrica: Omit<Rubrica, 'id'>) { const { data, error } = await supabase.from('rubricas').insert(rubrica).select().single(); if (error) throw error; return data as Rubrica; },
  async update(id: string, rubrica: Partial<Rubrica>) { const { data, error } = await supabase.from('rubricas').update(rubrica).eq('id', id).select().single(); if (error) throw error; return data as Rubrica; },
};
