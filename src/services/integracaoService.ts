import { supabase } from '@/integrations/supabase/client';

export interface CnabConfig {
  id: string;
  empresa_id: string;
  banco_nome: string;
  banco_codigo: string;
  agencia: string;
  conta: string;
  layout_cnab: string;
  convenio: string;
  created_at: string;
}

export interface WebhookConfig {
  id: string;
  nome: string;
  url: string;
  eventos: string[];
  ativo: boolean;
  created_at: string;
}

export const cnabService = {
  async getConfig(): Promise<CnabConfig | null> {
    const { data, error } = await supabase.from('cnab_configuracoes' as any).select('*').limit(1).maybeSingle();
    if (error) throw error;
    return data as unknown as CnabConfig;
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
  async listar(): Promise<WebhookConfig[]> {
    const { data, error } = await supabase.from('webhooks_config' as any).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as unknown as WebhookConfig[];
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
