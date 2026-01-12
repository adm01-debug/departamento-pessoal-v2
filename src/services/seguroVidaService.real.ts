// V17-S091: SeguroVidaService Real
import { supabase } from '@/integrations/supabase/client';
export const seguroVidaServiceReal = {
  async getSeguros(empresaId: string) { const { data } = await supabase.from('seguros_vida').select('*').eq('empresa_id', empresaId); return data || []; },
  async atribuir(colaboradorId: string, seguroId: string, beneficiarios: any[]) { const { data } = await supabase.from('colaborador_seguro_vida').insert({ colaborador_id: colaboradorId, seguro_id: seguroId, beneficiarios }).select().single(); return data; }
}; export default seguroVidaServiceReal;
