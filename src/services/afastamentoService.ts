// V15-392
import { supabase } from '@/integrations/supabase/client';
export interface Afastamento { id: string; colaborador_id: string; tipo: string; data_inicio: string; data_fim?: string; motivo?: string; cid?: string; documento_url?: string; status: 'ativo' | 'encerrado'; }
export const afastamentoService = {
  async list(colaboradorId?: string) { let query = supabase.from('afastamentos').select('*, colaborador:colaboradores(nome)').order('data_inicio', { ascending: false }); if (colaboradorId) query = query.eq('colaborador_id', colaboradorId); const { data, error } = await query; if (error) throw error; return data; },
  async create(afastamento: Omit<Afastamento, 'id'>) { const { data, error } = await supabase.from('afastamentos').insert(afastamento).select().single(); if (error) throw error; return data as Afastamento; },
  async update(id: string, afastamento: Partial<Afastamento>) { const { data, error } = await supabase.from('afastamentos').update(afastamento).eq('id', id).select().single(); if (error) throw error; return data as Afastamento; },
  async encerrar(id: string, dataFim: string) { return this.update(id, { data_fim: dataFim, status: 'encerrado' }); },
};
