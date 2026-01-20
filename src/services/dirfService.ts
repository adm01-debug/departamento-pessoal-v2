// V18-S007: DIRF Service Real - Declaração Imposto Retido na Fonte
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";

export interface DeclaracaoDIRF {
  id: string;
  empresa_id: string;
  ano_calendario: number;
  status: "pendente" | "gerada" | "enviada" | "aceita";
  xml?: string;
  recibo?: string;
  created_at: string;
}

export const dirfServiceReal = {
  async gerarDeclaracao(empresaId: string, anoCalendario: number): Promise<DeclaracaoDIRF> {
    const { data: empresa } = await supabase.from("empresas").select("*").eq("id", empresaId).single();
    const { data: colaboradores } = await supabase.from("colaboradores").select("*").eq("empresa_id", empresaId);
    
    const xml = this.gerarXML(empresa, colaboradores || [], anoCalendario);
    
    const { data, error } = await supabase.from("declaracoes_dirf").insert({
      empresa_id: empresaId,
      ano_calendario: anoCalendario,
      xml,
      status: "gerada"
    }).select().single();
    
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  gerarXML(empresa: any, colaboradores: any[], ano: number): string {
    return `<?xml version="1.0"?><DIRF ano="${ano}"><declarante cnpj="${empresa?.cnpj}"><beneficiarios>${colaboradores.map(c => `<beneficiario cpf="${c.cpf}"/>`).join("")}</beneficiarios></declarante></DIRF>`;
  },

  async getDeclaracoes(empresaId: string): Promise<DeclaracaoDIRF[]> {
    const { data, error } = await supabase.from("declaracoes_dirf").select("*").eq("empresa_id", empresaId).order("ano_calendario", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async downloadXML(declaracaoId: string): Promise<{ nome: string; conteudo: string }> {
    const { data, error } = await supabase.from("declaracoes_dirf").select("ano_calendario, xml").eq("id", declaracaoId).single();
    if (error) throw new Error(handleSupabaseError(error));
    return { nome: `DIRF_${data.ano_calendario}.xml`, conteudo: data.xml || "" };
  }
};

export default dirfServiceReal;
