// V17-S082: AdvertenciaService Real
import { supabase } from '@/integrations/supabase/client';
export const advertenciaServiceReal = {
  async getByColaborador(colaboradorId: string) { const { data } = await supabase.from('advertencias').select('*').eq('colaborador_id', colaboradorId).order('data', { ascending: false }); return data || []; },
  async criar(colaboradorId: string, motivo: string, tipo: 'verbal' | 'escrita', descricao: string) { const { data } = await supabase.from('advertencias').insert({ colaborador_id: colaboradorId, motivo, tipo, descricao, data: new Date().toISOString() }).select().single(); return data; }
}; export default advertenciaServiceReal;
