// V17-S065: ConfigService Real
import { supabase, handleSupabaseError } from '@/integrations/supabase/client';
export const configServiceReal = {
  async get(empresaId: string) { const { data, error } = await supabase.from('configuracoes').select('*').eq('empresa_id', empresaId).single(); if (error?.code === 'PGRST116') return {}; if (error) throw new Error(handleSupabaseError(error)); return data?.config || {}; },
  async set(empresaId: string, config: any) { const { error } = await supabase.from('configuracoes').upsert({ empresa_id: empresaId, config, updated_at: new Date().toISOString() }); if (error) throw new Error(handleSupabaseError(error)); },
  async getChave(empresaId: string, chave: string) { const config = await this.get(empresaId); return config[chave]; },
  async setChave(empresaId: string, chave: string, valor: any) { const config = await this.get(empresaId); config[chave] = valor; await this.set(empresaId, config); }
}; export default configServiceReal;
