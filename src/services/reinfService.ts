// @ts-nocheck
// V18-S010: EFD-Reinf Service - Escrituracao Fiscal Digital Retencoes
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";

export type TipoEventoReinf = "R-1000" | "R-1070" | "R-2010" | "R-2020" | "R-2030" | "R-2040" | "R-2050" | "R-2060" | "R-2098" | "R-2099" | "R-4010" | "R-4020" | "R-4040" | "R-4080" | "R-4099" | "R-9000";
export type StatusEventoReinf = "pendente" | "validando" | "enviado" | "aceito" | "rejeitado";

export interface EventoReinf {
  id: string;
  empresa_id: string;
  tipo_evento: TipoEventoReinf;
  competencia: string;
  dados: Record<string, unknown>;
  xml?: string;
  status: StatusEventoReinf;
  protocolo?: string;
  recibo?: string;
  erros?: string[];
  created_at: string;
}

export interface LoteReinf {
  id: string;
  empresa_id: string;
  eventos: string[];
  status: StatusEventoReinf;
  protocolo?: string;
  created_at: string;
}

export const reinfServiceReal = {
  // CRUD Eventos
  async criarEvento(empresaId: string, tipoEvento: TipoEventoReinf, dados: Record<string, unknown>, competencia: string): Promise<EventoReinf> {
    const { data, error } = await supabase.from("reinf_eventos").insert({
      empresa_id: empresaId,
      tipo_evento: tipoEvento,
      competencia,
      dados,
      status: "pendente"
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async getEventos(empresaId: string, filtros?: { competencia?: string; tipo?: TipoEventoReinf }): Promise<EventoReinf[]> {
    let query = supabase.from("reinf_eventos").select("*").eq("empresa_id", empresaId);
    if (filtros?.competencia) query = query.eq("competencia", filtros.competencia);
    if (filtros?.tipo) query = query.eq("tipo_evento", filtros.tipo);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  // Geracao de Eventos
  async gerarR1000(empresaId: string): Promise<EventoReinf> {
    const { data: empresa } = await supabase.from("empresas").select("*").eq("id", empresaId).single();
    
    const dados = {
      ideEmpregador: { tpInsc: 1, nrInsc: empresa?.cnpj },
      infoCadastro: {
        classTrib: empresa?.classificacao_tributaria,
        indEscrituracao: 1,
        indDesoneracao: 0,
        indAcordoIsenMulta: 0,
        contato: { nmCtt: empresa?.contato_nome, cpfCtt: empresa?.contato_cpf, foneFixo: empresa?.telefone, email: empresa?.email }
      }
    };
    
    return this.criarEvento(empresaId, "R-1000", dados, new Date().toISOString().substring(0, 7));
  },

  async gerarR2010(empresaId: string, competencia: string, prestadores: Array<{ cnpj: string; valor: number; retencao: number }>): Promise<EventoReinf> {
    const dados = {
      ideEvento: { perApur: competencia },
      infoServPrest: prestadores.map(p => ({
        cnpjPrestador: p.cnpj,
        vlrTotalBruto: p.valor,
        vlrRetencao: p.retencao
      }))
    };
    
    return this.criarEvento(empresaId, "R-2010", dados, competencia);
  },

  async gerarR2099(empresaId: string, competencia: string): Promise<EventoReinf> {
    const dados = {
      ideEvento: { perApur: competencia },
      ideResp: { evtServTm: "S", evtServPr: "S" },
      infoFech: { fechRet: 1 }
    };
    
    return this.criarEvento(empresaId, "R-2099", dados, competencia);
  },

  // Lotes
  async criarLote(empresaId: string, eventosIds: string[]): Promise<LoteReinf> {
    const { data, error } = await supabase.from("reinf_lotes").insert({
      empresa_id: empresaId,
      eventos: eventosIds,
      status: "pendente"
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async transmitirLote(loteId: string): Promise<LoteReinf> {
    const { data, error } = await supabase.from("reinf_lotes")
      .update({ status: "enviado" })
      .eq("id", loteId).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    
    await supabase.from("reinf_eventos")
      .update({ status: "enviado" })
      .in("id", data.eventos);
    
    return data;
  },

  // Utilidades
  getEventosDisponiveis(): Record<TipoEventoReinf, string> {
    return {
      "R-1000": "Informacoes do Contribuinte",
      "R-1070": "Tabela de Processos Administrativos/Judiciais",
      "R-2010": "Retencao - Servicos Tomados",
      "R-2020": "Retencao - Servicos Prestados",
      "R-2030": "Recursos Recebidos por Associacao Desportiva",
      "R-2040": "Recursos Repassados para Associacao Desportiva",
      "R-2050": "Comercializacao da Producao Rural PF",
      "R-2060": "Contribuicao Previdenciaria sobre Receita Bruta",
      "R-2098": "Reabertura de Eventos Periodicos",
      "R-2099": "Fechamento de Eventos Periodicos",
      "R-4010": "Pagamentos - Beneficiarios PF",
      "R-4020": "Pagamentos - Beneficiarios PJ",
      "R-4040": "Pagamentos - Beneficiarios Nao Identificados",
      "R-4080": "Retencao no Recebimento",
      "R-4099": "Fechamento Retencoes na Fonte",
      "R-9000": "Exclusao de Eventos"
    };
  }
};

export default reinfServiceReal;
