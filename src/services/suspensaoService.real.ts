// V17-S092: SuspensaoService Real
import { supabase } from '@/integrations/supabase/client';
export const suspensaoServiceReal = {
  async getByColaborador(colaboradorId: string) { const { data } = await supabase.from('suspensoes').select('*').eq('colaborador_id', colaboradorId); return data || []; },
  async aplicar(colaboradorId: string, dataInicio: string, dataFim: string, motivo: string) { const dias = Math.ceil((new Date(dataFim).getTime() - new Date(dataInicio).getTime()) / 86400000) + 1; const { data } = await supabase.from('suspensoes').insert({ colaborador_id: colaboradorId, data_inicio: dataInicio, data_fim: dataFim, dias, motivo }).select().single(); return data; }
}; export default suspensaoServiceReal;
