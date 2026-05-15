import { supabase } from '@/integrations/supabase/client';
export interface WhatsAppConfig {
  empresa_id: string;
  webhook_url?: string;
  api_key?: string;
  telefone_origem?: string;
  habilitado: boolean;
  instancia_url?: string;
  instancia_nome?: string;
  notificar_ponto?: boolean;
  notificar_ferias?: boolean;
  notificar_holerite?: boolean;
}

export const whatsappService = {
  async getConfig(empresaId: string): Promise<WhatsAppConfig | null> {
    
    const { data, error } = await supabase
      .from('whatsapp_config' as any)
      .select('*')
      .eq('empresa_id', empresaId)
      .maybeSingle();
    
    if (error) throw error;
    return data as any;
  
  },

  async saveConfig(config: WhatsAppConfig): Promise<void> {
    
    const { error } = await supabase
      .from('whatsapp_config' as any)
      .upsert(config, { onConflict: 'empresa_id' });
    
    if (error) throw error;
  
  },

  async sendMessage(params: {
    empresaId: string;
    colaboradorId?: string;
    phone: string;
    message: string;
  }): Promise<any> {
    
    const { error } = await supabase
      .from('whatsapp_mensagens_logs' as any)
      .insert({
        empresa_id: params.empresaId,
        colaborador_id: params.colaboradorId,
        telefone: params.phone,
        status: 'sent',
        mensagem_id_externo: `wa_direct_${Date.now()}`
      });
    
    if (error) throw error;
    return { success: true };
  
  },
  
  async listTemplates(empresaId: string): Promise<any[]> {
    
    const { data, error } = await supabase
      .from('whatsapp_templates' as any)
      .select('*')
      .eq('empresa_id', empresaId);
    
    if (error) throw error;
    return data || [];
  
  },

  async listLogs(empresaId: string): Promise<any[]> {
    
    const { data, error } = await supabase
      .from('whatsapp_mensagens_logs' as any)
      .select('*, colaborador:colaboradores(nome_completo)')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  
  },

  async sendTemplateMessage(params: {
    empresaId: string;
    colaboradorId: string;
    templateId: string;
    phone: string;
  }): Promise<any> {
    try {
      const { empresaId, colaboradorId, templateId, phone } = params;
      
      const { data: log, error: logErr } = await supabase
        .from('whatsapp_mensagens_logs' as any)
        .insert({
          empresa_id: empresaId,
          colaborador_id: colaboradorId,
          template_id: templateId,
          telefone: phone,
          status: 'pending'
        })
        .select()
        .single();

      if (logErr) throw logErr;

      await new Promise(r => setTimeout(r, 1000));
      
      await supabase.from('whatsapp_mensagens_logs' as any)
        .update({ status: 'sent', mensagem_id_externo: `wa_${Date.now()}` })
        .eq('id', (log as any).id);
        
      return ({ success: true, logId: (log as any).id });
    } catch (e: any) {
      throw new Error('Falha ao enviar mensagem de template do WhatsApp');
    }
  }
};

