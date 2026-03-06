// @ts-nocheck
// V15-399
import { supabase } from '@/integrations/supabase/client';
export interface Sindicato { id: string; nome: string; cnpj: string; contribuicao_mensal?: number; data_base?: string; telefone?: string; email?: string; }
export const sindicatoService = {
  async list() { const { data, error } = await supabase.from('sindicatos').select('*').order('nome'); if (error) throw error; return data as Sindicato[]; },
  async getById(id: string) { const { data, error } = await supabase.from('sindicatos').select('*').eq('id', id).single(); if (error) throw error; return data as Sindicato; },
  async create(sindicato: Omit<Sindicato, 'id'>) { const { data, error } = await supabase.from('sindicatos').insert(sindicato).select().single(); if (error) throw error; return data as Sindicato; },
  async update(id: string, sindicato: Partial<Sindicato>) { const { data, error } = await supabase.from('sindicatos').update(sindicato).eq('id', id).select().single(); if (error) throw error; return data as Sindicato; },
  async delete(id: string) { const { error } = await supabase.from('sindicatos').delete().eq('id', id); if (error) throw error; },
};
