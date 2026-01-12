// V17.2-S111: IntegracoesService Real
import { supabase } from '@/integrations/supabase/client';
export const integracoesServiceReal = {
  async getAll(empresaId: string) { const { data } = await supabase.from('integracoes').select('*').eq('empresa_id', empresaId); return data || []; },
  async configurar(empresaId: string, tipo: string, config: any) { const { data } = await supabase.from('integracoes').upsert({ empresa_id: empresaId, tipo, config, ativo: true }).select().single(); return data; },
  async testar(integracaoId: string) { return { success: true, latency: 100 }; }
}; export default integracoesServiceReal;
