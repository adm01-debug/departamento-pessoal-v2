// V17-S090: PlanoSaudeService Real
import { supabase } from '@/integrations/supabase/client';
export const planoSaudeServiceReal = {
  async getPlanos(empresaId: string) { const { data } = await supabase.from('planos_saude').select('*').eq('empresa_id', empresaId); return data || []; },
  async atribuir(colaboradorId: string, planoId: string, dependentes?: string[]) { const { data } = await supabase.from('colaborador_plano_saude').insert({ colaborador_id: colaboradorId, plano_id: planoId, dependentes }).select().single(); return data; },
  async calcularDesconto(colaboradorId: string) { const { data } = await supabase.from('colaborador_plano_saude').select('*, plano:planos_saude(*)').eq('colaborador_id', colaboradorId).single(); if (!data) return 0; return data.plano.valor_titular + (data.dependentes?.length || 0) * data.plano.valor_dependente; }
}; export default planoSaudeServiceReal;
