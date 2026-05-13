import { supabase } from '@/integrations/supabase/client';

export const whatsappService = {
  async listTemplates(empresaId: string) {
    const { data, error } = await supabase
      .from('whatsapp_templates' as any)
      .select('*')
      .eq('empresa_id', empresaId);
    
    if (error) throw error;
    return data;
  },

  async listLogs(empresaId: string) {
    const { data, error } = await supabase
      .from('whatsapp_mensagens_logs' as any)
      .select('*, colaborador:colaboradores(nome_completo)')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async sendTemplateMessage(params: {
    empresaId: string;
    colaboradorId: string;
    templateId: string;
    phone: string;
  }) {
    const { empresaId, colaboradorId, templateId, phone } = params;
    
    // 1. Criar log de intenção
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

    // 2. Chamar Edge Function que integra com Meta/Twilio (Simulado)
    try {
      // await supabase.functions.invoke('enviar-whatsapp', { body: { logId: log.id } });
      
      // Simulação realista de sucesso
      await new Promise(r => setTimeout(r, 1000));
      
      await supabase.from('whatsapp_mensagens_logs' as any)
        .update({ status: 'sent', mensagem_id_externo: `wa_${Date.now()}` })
        .eq('id', (log as any).id);
        
      return { success: true, logId: (log as any).id };
    } catch (e) {
      await supabase.from('whatsapp_mensagens_logs' as any)
        .update({ status: 'failed', error_message: (e as Error).message })
        .eq('id', (log as any).id);
      throw e;
    }
  }
};
