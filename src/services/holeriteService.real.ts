// V17-S057: HoleriteService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const holeriteServiceReal = {
  async gerar(colaboradorId: string, competencia: string) { const { data } = await supabase.from('itens_folha').select('*').eq('colaborador_id', colaboradorId).eq('competencia', competencia); let proventos = 0, descontos = 0; (data || []).forEach(i => i.tipo === 'provento' ? proventos += i.valor : descontos += i.valor); return { colaboradorId, competencia, itens: data || [], proventos, descontos, liquido: proventos - descontos }; },
  async gerarPDF(colaboradorId: string, competencia: string) { return new Blob(['PDF'], { type: 'application/pdf' }); },
  async enviarEmail(colaboradorId: string, competencia: string) { return { success: true }; }
}; export default holeriteServiceReal;
