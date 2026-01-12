// V17-S087: OnboardingService Real
import { supabase } from '@/integrations/supabase/client';
export const onboardingServiceReal = {
  async iniciar(colaboradorId: string) { const etapas = ['documentos', 'sistemas', 'equipamentos', 'treinamento', 'apresentacao']; const { data } = await supabase.from('onboarding').insert({ colaborador_id: colaboradorId, etapas, etapa_atual: 0, status: 'em_andamento' }).select().single(); return data; },
  async avancarEtapa(onboardingId: string) { const { data: ob } = await supabase.from('onboarding').select('*').eq('id', onboardingId).single(); if (!ob) return; const novaEtapa = ob.etapa_atual + 1; const status = novaEtapa >= ob.etapas.length ? 'concluido' : 'em_andamento'; await supabase.from('onboarding').update({ etapa_atual: novaEtapa, status }).eq('id', onboardingId); },
  async getByColaborador(colaboradorId: string) { const { data } = await supabase.from('onboarding').select('*').eq('colaborador_id', colaboradorId).single(); return data; }
}; export default onboardingServiceReal;
