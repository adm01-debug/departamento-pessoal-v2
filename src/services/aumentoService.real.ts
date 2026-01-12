// V17-S093: AumentoService Real
import { supabase } from '@/integrations/supabase/client';
export const aumentoServiceReal = {
  async conceder(colaboradorId: string, salarioAnterior: number, salarioNovo: number, motivo: string, dataVigencia: string) { const percentual = ((salarioNovo - salarioAnterior) / salarioAnterior) * 100; const { data } = await supabase.from('aumentos').insert({ colaborador_id: colaboradorId, salario_anterior: salarioAnterior, salario_novo: salarioNovo, percentual, motivo, data_vigencia: dataVigencia }).select().single(); await supabase.from('colaboradores').update({ salario: salarioNovo }).eq('id', colaboradorId); return data; },
  async getHistorico(colaboradorId: string) { const { data } = await supabase.from('aumentos').select('*').eq('colaborador_id', colaboradorId).order('data_vigencia', { ascending: false }); return data || []; }
}; export default aumentoServiceReal;
