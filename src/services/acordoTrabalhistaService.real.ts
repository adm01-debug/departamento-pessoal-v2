// V17-S081: AcordoTrabalhistaService Real
import { supabase } from '@/integrations/supabase/client';
export const acordoTrabalhistaServiceReal = {
  async getAll(empresaId: string) { const { data } = await supabase.from('acordos_trabalhistas').select('*').eq('empresa_id', empresaId); return data || []; },
  async create(acordo: any) { const { data } = await supabase.from('acordos_trabalhistas').insert(acordo).select().single(); return data; }
}; export default acordoTrabalhistaServiceReal;
