// V17-S018: HistoricoService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export interface Historico { id: string; colaborador_id: string; tipo: string; data_alteracao: string; valor_anterior?: any; valor_novo?: any; motivo?: string; usuario_id?: string; }
export const historicoServiceReal = {
  async getByColaborador(colaboradorId: string) { const { data, error } = await supabase.from('historicos').select('*').eq('colaborador_id', colaboradorId).order('data_alteracao', { ascending: false }); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async registrar(colaboradorId: string, tipo: string, valorAnterior: any, valorNovo: any, usuarioId?: string) { const { data, error } = await supabase.from('historicos').insert({ colaborador_id: colaboradorId, tipo, data_alteracao: new Date().toISOString(), valor_anterior: valorAnterior, valor_novo: valorNovo, usuario_id: usuarioId }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; }
}; export default historicoServiceReal;
