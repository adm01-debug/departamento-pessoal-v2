// V17-S080: EnqueteService Real
import { supabase } from '@/integrations/supabase/client';
export const enqueteServiceReal = {
  async criar(empresaId: string, titulo: string, opcoes: string[], dataFim: string) { const { data } = await supabase.from('enquetes').insert({ empresa_id: empresaId, titulo, opcoes, data_fim: dataFim, ativa: true }).select().single(); return data; },
  async votar(enqueteId: string, colaboradorId: string, opcao: number) { await supabase.from('enquete_votos').insert({ enquete_id: enqueteId, colaborador_id: colaboradorId, opcao }); },
  async getResultados(enqueteId: string) { const { data } = await supabase.from('enquete_votos').select('opcao').eq('enquete_id', enqueteId); return data || []; }
}; export default enqueteServiceReal;
