// V15-391
import { supabase } from '@/integrations/supabase/client';
export interface Dependente { id: string; colaborador_id: string; nome: string; parentesco: string; data_nascimento: string; cpf?: string; ir_deducao: boolean; salario_familia: boolean; }
export const dependenteService = {
  async list(colaboradorId: string) { const { data, error } = await supabase.from('dependentes').select('*').eq('colaborador_id', colaboradorId).order('nome'); if (error) throw error; return data as Dependente[]; },
  async create(dependente: Omit<Dependente, 'id'>) { const { data, error } = await supabase.from('dependentes').insert(dependente).select().single(); if (error) throw error; return data as Dependente; },
  async update(id: string, dependente: Partial<Dependente>) { const { data, error } = await supabase.from('dependentes').update(dependente).eq('id', id).select().single(); if (error) throw error; return data as Dependente; },
  async delete(id: string) { const { error } = await supabase.from('dependentes').delete().eq('id', id); if (error) throw error; },
};
