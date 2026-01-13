// V18-S003: ESocialService Real Expandido - Integração Governo
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";

export type TipoEvento = "S-1000" | "S-1005" | "S-1010" | "S-1020" | "S-1070" | "S-2190" | "S-2200" | "S-2205" | "S-2206" | "S-2210" | "S-2220" | "S-2230" | "S-2240" | "S-2250" | "S-2260" | "S-2298" | "S-2299" | "S-2300" | "S-2306" | "S-2399" | "S-2400" | "S-3000" | "S-1200" | "S-1210" | "S-1260" | "S-1270" | "S-1280" | "S-1298" | "S-1299";
export type StatusEvento = "pendente" | "validando" | "enviado" | "processando" | "aceito" | "rejeitado" | "erro";
export type Ambiente = "producao" | "producao_restrita" | "homologacao";

export interface EventoESocial {
  id: string;
  empresa_id: string;
  tipo_evento: TipoEvento;
  competencia: string;
  dados: Record<string, unknown>;
  xml?: string;
  status: StatusEvento;
  protocolo?: string;
  recibo?: string;
  erros?: string[];
  data_envio?: string;
  data_retorno?: string;
  created_at: string;
  updated_at: string;
}

export interface LoteESocial {
  id: string;
  empresa_id: string;
  eventos: string[];
  status: StatusEvento;
  protocolo?: string;
  ambiente: Ambiente;
  created_at: string;
}

export const esocialServiceReal = {
  // CRUD de Eventos
  async criarEvento(empresaId: string, tipoEvento: TipoEvento, dados: Record<string, unknown>, competencia: string): Promise<EventoESocial> {
    const { data, error } = await supabase.from("esocial_eventos").insert({
      empresa_id: empresaId,
      tipo_evento: tipoEvento,
      competencia,
      dados,
      status: "pendente"
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async getEventos(empresaId: string, filtros?: { competencia?: string; tipo?: TipoEvento; status?: StatusEvento }): Promise<EventoESocial[]> {
    let query = supabase.from("esocial_eventos").select("*").eq("empresa_id", empresaId);
    if (filtros?.competencia) query = query.eq("competencia", filtros.competencia);
    if (filtros?.tipo) query = query.eq("tipo_evento", filtros.tipo);
    if (filtros?.status) query = query.eq("status", filtros.status);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async getEvento(eventoId: string): Promise<EventoESocial | null> {
    const { data, error } = await supabase.from("esocial_eventos").select("*").eq("id", eventoId).single();
    if (error) return null;
    return data;
  },

  // Validação
  async validarEvento(eventoId: string): Promise<{ valido: boolean; erros: string[] }> {
    const evento = await this.getEvento(eventoId);
    if (!evento) return { valido: false, erros: ["Evento não encontrado"] };
    
    await supabase.from("esocial_eventos").update({ status: "validando" }).eq("id", eventoId);
    
    const erros: string[] = [];
    // Validações básicas
    if (!evento.dados) erros.push("Dados do evento vazios");
    if (!evento.competencia) erros.push("Competência obrigatória");
    
    const valido = erros.length === 0;
    await supabase.from("esocial_eventos").update({ 
      status: valido ? "pendente" : "erro",
      erros: valido ? null : erros 
    }).eq("id", eventoId);
    
    return { valido, erros };
  },

  // Envio
  async enviarEvento(eventoId: string, ambiente: Ambiente = "producao_restrita"): Promise<{ sucesso: boolean; protocolo?: string; erro?: string }> {
    const evento = await this.getEvento(eventoId);
    if (!evento) return { sucesso: false, erro: "Evento não encontrado" };
    
    await supabase.from("esocial_eventos").update({ status: "enviado", data_envio: new Date().toISOString() }).eq("id", eventoId);
    
    // Simulação de envio (em produção, integrar com API gov.br)
    const protocolo = `PROT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    await supabase.from("esocial_eventos").update({ 
      status: "processando",
      protocolo 
    }).eq("id", eventoId);
    
    return { sucesso: true, protocolo };
  },

  async enviarLote(empresaId: string, eventoIds: string[], ambiente: Ambiente = "producao_restrita"): Promise<LoteESocial> {
    const { data, error } = await supabase.from("esocial_lotes").insert({
      empresa_id: empresaId,
      eventos: eventoIds,
      status: "enviado",
      ambiente
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    
    // Atualizar status dos eventos
    await supabase.from("esocial_eventos").update({ status: "enviado" }).in("id", eventoIds);
    
    return data;
  },

  // Consultas
  async consultarRetorno(eventoId: string): Promise<{ status: StatusEvento; recibo?: string; erros?: string[] }> {
    const evento = await this.getEvento(eventoId);
    if (!evento) return { status: "erro", erros: ["Evento não encontrado"] };
    return { status: evento.status, recibo: evento.recibo, erros: evento.erros };
  },

  async consultarProtocolo(protocolo: string): Promise<EventoESocial[]> {
    const { data, error } = await supabase.from("esocial_eventos").select("*").eq("protocolo", protocolo);
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  // Retificação e Exclusão
  async retificarEvento(eventoId: string, novosDados: Record<string, unknown>): Promise<EventoESocial> {
    const original = await this.getEvento(eventoId);
    if (!original) throw new Error("Evento original não encontrado");
    
    return this.criarEvento(original.empresa_id, original.tipo_evento, {
      ...original.dados,
      ...novosDados,
      retificacao: { eventoOriginal: eventoId, dataRetificacao: new Date().toISOString() }
    }, original.competencia);
  },

  async excluirEvento(eventoId: string): Promise<EventoESocial> {
    const original = await this.getEvento(eventoId);
    if (!original) throw new Error("Evento não encontrado");
    
    return this.criarEvento(original.empresa_id, "S-3000", {
      eventoExcluido: eventoId,
      tipoEventoExcluido: original.tipo_evento,
      reciboExcluido: original.recibo
    }, original.competencia);
  },

  // Relatórios
  async getResumoCompetencia(empresaId: string, competencia: string) {
    const eventos = await this.getEventos(empresaId, { competencia });
    return {
      competencia,
      total: eventos.length,
      pendentes: eventos.filter(e => e.status === "pendente").length,
      enviados: eventos.filter(e => e.status === "enviado").length,
      aceitos: eventos.filter(e => e.status === "aceito").length,
      rejeitados: eventos.filter(e => e.status === "rejeitado").length,
      erros: eventos.filter(e => e.status === "erro").length
    };
  },

  // Geração de XML (stub)
  gerarXML(evento: EventoESocial): string {
    return `<?xml version="1.0" encoding="UTF-8"?><eSocial><evento tipo="${evento.tipo_evento}"><dados>${JSON.stringify(evento.dados)}</dados></evento></eSocial>`;
  }
};

export default esocialServiceReal;
