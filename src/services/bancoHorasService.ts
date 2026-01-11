// V15-394
import { supabase } from '@/integrations/supabase/client';
export interface MovimentacaoBancoHoras { id: string; colaborador_id: string; data: string; tipo: 'credito' | 'debito'; minutos: number; motivo: string; referencia_id?: string; }
export const bancoHorasService = {
  async getSaldo(colaboradorId: string) { const { data, error } = await supabase.from('banco_horas').select('tipo, minutos').eq('colaborador_id', colaboradorId); if (error) throw error; return data.reduce((acc, m) => acc + (m.tipo === 'credito' ? m.minutos : -m.minutos), 0); },
  async list(colaboradorId: string, dataInicio?: string, dataFim?: string) { let query = supabase.from('banco_horas').select('*').eq('colaborador_id', colaboradorId).order('data', { ascending: false }); if (dataInicio) query = query.gte('data', dataInicio); if (dataFim) query = query.lte('data', dataFim); const { data, error } = await query; if (error) throw error; return data as MovimentacaoBancoHoras[]; },
  async registrar(movimentacao: Omit<MovimentacaoBancoHoras, 'id'>) { const { data, error } = await supabase.from('banco_horas').insert(movimentacao).select().single(); if (error) throw error; return data as MovimentacaoBancoHoras; },
};
