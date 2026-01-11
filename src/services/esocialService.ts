// V15-395
import { supabase } from '@/integrations/supabase/client';
export interface EventoESocial { id: string; empresa_id: string; codigo: string; nome: string; status: 'pendente' | 'enviado' | 'processando' | 'erro' | 'aceito'; data_envio?: string; protocolo?: string; mensagem_erro?: string; xml?: string; }
export const esocialService = {
  async list(empresaId: string, status?: string) { let query = supabase.from('esocial_eventos').select('*').eq('empresa_id', empresaId).order('created_at', { ascending: false }); if (status) query = query.eq('status', status); const { data, error } = await query; if (error) throw error; return data as EventoESocial[]; },
  async getById(id: string) { const { data, error } = await supabase.from('esocial_eventos').select('*').eq('id', id).single(); if (error) throw error; return data as EventoESocial; },
  async enviar(id: string) { const { data, error } = await supabase.from('esocial_eventos').update({ status: 'enviado', data_envio: new Date().toISOString() }).eq('id', id).select().single(); if (error) throw error; return data; },
  async consultar(id: string) { const evento = await this.getById(id); return evento; },
};
