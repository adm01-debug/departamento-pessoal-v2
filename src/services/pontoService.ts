// V15-211: src/services/pontoService.ts
import { supabase } from '@/integrations/supabase/client';
import type { RegistroPonto, EspelhoPonto, TipoRegistro } from '@/types';

export const pontoService = {
  async registrar(colaboradorId: string, tipo: TipoRegistro, coords?: { lat: number; lng: number }) {
    const registro = {
      colaborador_id: colaboradorId,
      data: new Date().toISOString().split('T')[0],
      tipo,
      hora: new Date().toTimeString().split(' ')[0],
      latitude: coords?.lat,
      longitude: coords?.lng,
    };
    const { data, error } = await supabase.from('registros_ponto').insert(registro).select().single();
    if (error) throw error;
    return data as RegistroPonto;
  },

  async listByColaborador(colaboradorId: string, dataInicio: string, dataFim: string) {
    const { data, error } = await supabase.from('registros_ponto').select('*').eq('colaborador_id', colaboradorId).gte('data', dataInicio).lte('data', dataFim).order('data').order('hora');
    if (error) throw error;
    return data as RegistroPonto[];
  },

  async getEspelho(colaboradorId: string, competencia: string) {
    const { data, error } = await supabase.rpc('gerar_espelho_ponto', { p_colaborador_id: colaboradorId, p_competencia: competencia });
    if (error) throw error;
    return data as EspelhoPonto;
  },

  async ajustar(id: string, hora: string, motivo: string, aprovadorId: string) {
    const { data, error } = await supabase.from('registros_ponto').update({ hora, ajustado: true, motivo_ajuste: motivo, aprovador_ajuste_id: aprovadorId }).eq('id', id).select().single();
    if (error) throw error;
    return data as RegistroPonto;
  }
};
