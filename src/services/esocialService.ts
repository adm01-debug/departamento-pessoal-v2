import { supabase } from '@/integrations/supabase/client';
import { EventoESocial, EventoESocialFilters, LoteESocial, EventoESocialTipo } from '@/types/esocial';

export const esocialService = {
  async listarEventos(filters?: EventoESocialFilters): Promise<EventoESocial[]> {
    let query = supabase.from('eventos_esocial').select('*');
    
    if (filters?.tipo) query = query.eq('tipo', filters.tipo);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.colaborador_id) query = query.eq('colaborador_id', filters.colaborador_id);
    if (filters?.data_inicio) query = query.gte('data_evento', filters.data_inicio);
    if (filters?.data_fim) query = query.lte('data_evento', filters.data_fim);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async criarEvento(evento: Omit<EventoESocial, 'id' | 'created_at'>): Promise<EventoESocial> {
    const { data, error } = await supabase.from('eventos_esocial').insert(evento).select().single();
    if (error) throw error;
    return data;
  },

  async enviarEvento(id: string): Promise<EventoESocial> {
    const { data, error } = await supabase
      .from('eventos_esocial')
      .update({ status: 'enviado', data_envio: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async criarLote(eventos_ids: string[], empresa_id: string): Promise<LoteESocial> {
    const { data, error } = await supabase
      .from('lotes_esocial')
      .insert({ eventos_ids, empresa_id, status: 'aguardando' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async gerarXML(tipo: EventoESocialTipo, dados: Record<string, unknown>): Promise<string> {
    // Implementação simplificada - em produção usar biblioteca XML
    return `<?xml version="1.0"?><eSocial xmlns="http://www.esocial.gov.br/schema/evt/${tipo}/v1"><evtInfoEmpregador>${JSON.stringify(dados)}</evtInfoEmpregador></eSocial>`;
  },

  async consultarRecibo(protocolo: string): Promise<{ status: string; recibo?: string }> {
    // Em produção, consultar API do governo
    return { status: 'processando' };
  },
};

export default esocialService;

