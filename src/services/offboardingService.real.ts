// V17-S088: OffboardingService Real
import { supabase } from '@/integrations/supabase/client';
export const offboardingServiceReal = {
  async iniciar(colaboradorId: string) { const etapas = ['documentos', 'equipamentos', 'sistemas', 'entrevista', 'rescisao']; const { data } = await supabase.from('offboarding').insert({ colaborador_id: colaboradorId, etapas, etapa_atual: 0, status: 'em_andamento' }).select().single(); return data; },
  async avancarEtapa(offboardingId: string) { const { data: ob } = await supabase.from('offboarding').select('*').eq('id', offboardingId).single(); if (!ob) return; const novaEtapa = ob.etapa_atual + 1; const status = novaEtapa >= ob.etapas.length ? 'concluido' : 'em_andamento'; await supabase.from('offboarding').update({ etapa_atual: novaEtapa, status }).eq('id', offboardingId); }
}; export default offboardingServiceReal;
