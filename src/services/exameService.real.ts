// V17-S085: ExameService Real
import { supabase } from '@/integrations/supabase/client';
export type TipoExame = 'admissional' | 'periodico' | 'retorno' | 'mudanca_funcao' | 'demissional';
export const exameServiceReal = {
  async getByColaborador(colaboradorId: string) { const { data } = await supabase.from('exames').select('*').eq('colaborador_id', colaboradorId).order('data', { ascending: false }); return data || []; },
  async agendar(colaboradorId: string, tipo: TipoExame, data: string, clinica: string) { const { data: exame } = await supabase.from('exames').insert({ colaborador_id: colaboradorId, tipo, data, clinica, status: 'agendado' }).select().single(); return exame; },
  async registrarResultado(exameId: string, resultado: 'apto' | 'inapto', observacoes?: string) { await supabase.from('exames').update({ resultado, observacoes, status: 'realizado' }).eq('id', exameId); },
  async getProximos(empresaId: string, dias: number = 30) { const dataLimite = new Date(); dataLimite.setDate(dataLimite.getDate() + dias); const { data } = await supabase.from('exames').select('*, colaborador:colaboradores(nome)').eq('status', 'agendado').lte('data', dataLimite.toISOString()); return data || []; }
}; export default exameServiceReal;
