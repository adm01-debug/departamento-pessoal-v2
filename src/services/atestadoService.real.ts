// V17-S083: AtestadoService Real
import { supabase } from '@/integrations/supabase/client';
export const atestadoServiceReal = {
  async getByColaborador(colaboradorId: string) { const { data } = await supabase.from('atestados').select('*').eq('colaborador_id', colaboradorId).order('data_inicio', { ascending: false }); return data || []; },
  async registrar(colaboradorId: string, cid: string, dataInicio: string, dataFim: string, medico: string, crm: string) { const dias = Math.ceil((new Date(dataFim).getTime() - new Date(dataInicio).getTime()) / 86400000) + 1; const { data } = await supabase.from('atestados').insert({ colaborador_id: colaboradorId, cid, data_inicio: dataInicio, data_fim: dataFim, dias, medico, crm }).select().single(); return data; }
}; export default atestadoServiceReal;
