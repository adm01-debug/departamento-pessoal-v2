import { supabase } from '@/integrations/supabase/client';

export interface WhatsAppConfig {
  id: string;
  empresa_id: string;
  instancia_url: string | null;
  api_key: string | null;
  instancia_nome: string | null;
  status: string;
  notificar_ponto: boolean;
  notificar_ferias: boolean;
  notificar_holerite: boolean;
}

export const whatsappService = {
  async getConfig(empresaId: string): Promise<WhatsAppConfig | null> {
    const { data, error } = await supabase
      .from('whatsapp_config' as any)
      .select('*')
      .eq('empresa_id', empresaId)
      .maybeSingle();
    
    if (error) throw error;
    return data as any as WhatsAppConfig | null;
  },

  async saveConfig(config: Partial<WhatsAppConfig>) {
    const { error } = await supabase
      .from('whatsapp_config' as any)
      .upsert(config, { onConflict: 'empresa_id' });
    if (error) throw error;
  },

  async testConnection(config: WhatsAppConfig): Promise<boolean> {
    if (!config.instancia_url || !config.api_key) return false;
    
    try {
      // Evolution API pattern for status
      const response = await fetch(`${config.instancia_url}/instance/connectionState/${config.instancia_nome || 'default'}`, {
        headers: {
          'apikey': config.api_key
        }
      });
      const data = await response.json();
      return data.instance?.state === 'open';
    } catch (e) {
      console.error('Falha ao testar conexão WhatsApp', e);
      return false;
    }
  },

  async sendMessage(empresaId: string, phone: string, message: string) {
    const config = await this.getConfig(empresaId);
    if (!config || !config.instancia_url || !config.api_key) return;

    try {
      await fetch(`${config.instancia_url}/message/sendText/${config.instancia_nome || 'default'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.api_key
        },
        body: JSON.stringify({
          number: phone.replace(/\D/g, ''),
          text: message
        })
      });
    } catch (e) {
      console.error('Falha ao enviar mensagem WhatsApp', e);
    }
  }
};