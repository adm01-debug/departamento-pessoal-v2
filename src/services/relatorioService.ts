// V17-S051: RelatorioService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export type TipoRelatorio = 'folha' | 'ferias' | 'rescisao' | 'ponto' | 'beneficios' | 'encargos' | 'analitico';
export const relatorioServiceReal = {
  async gerar(empresaId: string, tipo: TipoRelatorio, params: any) { return { tipo, geradoEm: new Date().toISOString(), dados: [] }; },
  async getHistorico(empresaId: string) { const { data, error } = await supabase.from('relatorios_historico').select('*').eq('empresa_id', empresaId).order('created_at', { ascending: false }); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async agendar(empresaId: string, tipo: TipoRelatorio, periodicidade: string, email: string) { const { data, error } = await supabase.from('relatorios_agendados').insert({ empresa_id: empresaId, tipo, periodicidade, email }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; }
};
export default relatorioServiceReal;
