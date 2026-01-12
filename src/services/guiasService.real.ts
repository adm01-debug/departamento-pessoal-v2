// V17-S035: GuiasService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export type TipoGuia = 'GPS' | 'DARF' | 'FGTS' | 'GRRF' | 'DAE';
export const guiasServiceReal = {
  async getByCompetencia(empresaId: string, competencia: string) { const { data, error } = await supabase.from('guias').select('*').eq('empresa_id', empresaId).eq('competencia', competencia); if (error) throw new Error(handleSupabaseError(error)); return data || []; },
  async gerar(empresaId: string, competencia: string, tipo: TipoGuia, valor: number) { const vencimento = this.calcularVencimento(competencia, tipo); const { data, error } = await supabase.from('guias').insert({ empresa_id: empresaId, competencia, tipo, valor, vencimento, status: 'pendente' }).select().single(); if (error) throw new Error(handleSupabaseError(error)); return data; },
  calcularVencimento(competencia: string, tipo: TipoGuia) { const [ano, mes] = competencia.split('-').map(Number); const dia = tipo === 'FGTS' ? 7 : tipo === 'GPS' ? 20 : tipo === 'DARF' ? 20 : 10; return new Date(ano, mes, dia).toISOString().split('T')[0]; },
  async marcarPaga(guiaId: string, dataPagamento: string) { const { error } = await supabase.from('guias').update({ status: 'paga', data_pagamento: dataPagamento }).eq('id', guiaId); if (error) throw new Error(handleSupabaseError(error)); }
};
export default guiasServiceReal;
