// V17-S095: ConvenioService Real
import { supabase } from '@/integrations/supabase/client';
export const convenioServiceReal = {
  async getAll(empresaId: string) { const { data } = await supabase.from('convenios').select('*').eq('empresa_id', empresaId); return data || []; },
  async criar(empresaId: string, nome: string, tipo: string, desconto?: number) { const { data } = await supabase.from('convenios').insert({ empresa_id: empresaId, nome, tipo, desconto }).select().single(); return data; },
  async atribuir(colaboradorId: string, convenioId: string) { await supabase.from('colaborador_convenios').insert({ colaborador_id: colaboradorId, convenio_id: convenioId }); }
}; export default convenioServiceReal;
