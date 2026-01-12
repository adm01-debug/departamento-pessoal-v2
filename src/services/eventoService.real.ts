// V17-S097: EventoService Real
import { supabase } from '@/integrations/supabase/client';
export const eventoServiceReal = {
  async getAll(empresaId: string) { const { data } = await supabase.from('eventos').select('*').eq('empresa_id', empresaId); return data || []; },
  async criar(empresaId: string, nome: string, data: string, descricao?: string) { const { data: evt } = await supabase.from('eventos').insert({ empresa_id: empresaId, nome, data, descricao }).select().single(); return evt; }
}; export default eventoServiceReal;
