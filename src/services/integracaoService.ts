import { supabase } from '@/integrations/supabase/client';

export const cnabService = {
  async getConfig() {
    const { data, error } = await supabase.from('cnab_configuracoes' as any).select('*').limit(1).maybeSingle();
    if (error) throw error;
    return data;
  },
  async saveConfig(d: any) {
    const { error } = await supabase.from('cnab_configuracoes' as any).upsert(d);
    if (error) throw error;
  },
  async getRemessas() {
    const { data, error } = await supabase.from('cnab_remessas' as any).select('*').order('created_at', { ascending: false }).limit(50);
    if (error) throw error;
    return data || [];
  }
};

export const webhookService = {
  async listar() {
    const { data, error } = await supabase.from('webhooks_config' as any).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
  async criar(d: any) {
    const { error } = await supabase.from('webhooks_config' as any).insert(d);
    if (error) throw error;
  },
  async excluir(id: string) {
    const { error } = await supabase.from('webhooks_config' as any).delete().eq('id', id);
    if (error) throw error;
  },
  async getLogs() {
    const { data, error } = await supabase.from('webhook_logs' as any).select('*').order('created_at', { ascending: false }).limit(50);
    if (error) throw error;
    return data || [];
  }
};
