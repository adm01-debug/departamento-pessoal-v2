import { supabase } from '@/integrations/supabase/client';
import { EventoESocial, EventoESocialFilters, LoteESocial, EventoESocialTipo } from '@/types/esocial';
import { logger } from '@/lib/logger';

const EVENTO_FIELDS = 'id, tipo, colaborador_id, empresa_id, data_evento, status, xml, protocolo, recibo, data_envio, data_retorno, erro, created_at';

export const esocialService = {
  async listarEventos(filters?: EventoESocialFilters): Promise<EventoESocial[]> {
    try {
      let query = supabase.from('eventos_esocial').select(EVENTO_FIELDS);
      
      if (filters?.tipo) query = query.eq('tipo', filters.tipo);
      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.colaborador_id) query = query.eq('colaborador_id', filters.colaborador_id);
      if (filters?.data_inicio) query = query.gte('data_evento', filters.data_inicio);
      if (filters?.data_fim) query = query.lte('data_evento', filters.data_fim);
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    } catch (error) {
      logger.error('Erro ao listar eventos eSocial:', error);
      throw error;
    }
  },

  async criarEvento(evento: Omit<EventoESocial, 'id' | 'created_at'>): Promise<EventoESocial> {
    try {
      const { data, error } = await supabase.from('eventos_esocial').insert(evento).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar evento eSocial:', error);
      throw error;
    }
  },

  async enviarEvento(id: string): Promise<EventoESocial> {
    try {
      const { data, error } = await supabase
        .from('eventos_esocial')
        .update({ status: 'enviado', data_envio: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao enviar evento eSocial:', error);
      throw error;
    }
  },

  async criarLote(eventos_ids: string[], empresa_id: string): Promise<LoteESocial> {
    try {
      const { data, error } = await supabase
        .from('lotes_esocial')
        .insert({ eventos_ids, empresa_id, status: 'aguardando' })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erro ao criar lote eSocial:', error);
      throw error;
    }
  },

  async gerarXML(tipo: EventoESocialTipo, dados: Record<string, unknown>): Promise<string> {
    try {
      // Implementação simplificada - em produção usar biblioteca XML
      return `<?xml version="1.0"?><eSocial xmlns="http://www.esocial.gov.br/schema/evt/${tipo}/v1"><evtInfoEmpregador>${JSON.stringify(dados)}</evtInfoEmpregador></eSocial>`;
    } catch (error) {
      logger.error('Erro ao gerar XML eSocial:', error);
      throw error;
    }
  },

  async consultarRecibo(protocolo: string): Promise<{ status: string; recibo?: string }> {
    try {
      // Em produção, consultar API do governo
      return { status: 'processando' };
    } catch (error) {
      logger.error('Erro ao consultar recibo eSocial:', error);
      throw error;
    }
  },
};

export default esocialService;
