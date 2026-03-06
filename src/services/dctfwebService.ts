// @ts-nocheck
// V18-S008: DCTFWeb Service - Integracao eSocial/EFD-Reinf
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";

export type StatusDCTF = "pendente" | "gerando" | "gerado" | "transmitido" | "processado" | "erro";
export type TipoDebito = "inss" | "terceiros" | "gilrat" | "pis" | "cofins" | "csll";

export interface DebitoDCTF {
  tipo: TipoDebito;
  codigoReceita: string;
  valor: number;
  competencia: string;
}

export interface DeclaracaoDCTFWeb {
  id: string;
  empresa_id: string;
  competencia: string;
  status: StatusDCTF;
  debitos: DebitoDCTF[];
  total_debitos: number;
  protocolo?: string;
  data_transmissao?: string;
  created_at: string;
}

export const dctfwebServiceReal = {
  async criarDeclaracao(empresaId: string, competencia: string): Promise<DeclaracaoDCTFWeb> {
    const { data, error } = await supabase.from("dctfweb_declaracoes").insert({
      empresa_id: empresaId,
      competencia,
      status: "pendente",
      debitos: [],
      total_debitos: 0
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async getDeclaracoes(empresaId: string, ano?: number): Promise<DeclaracaoDCTFWeb[]> {
    let query = supabase.from("dctfweb_declaracoes").select("*").eq("empresa_id", empresaId);
    if (ano) query = query.like("competencia", `${ano}%`);
    const { data, error } = await query.order("competencia", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async gerarDeclaracao(empresaId: string, competencia: string): Promise<DeclaracaoDCTFWeb> {
    const debitos = await this.calcularDebitos(empresaId, competencia);
    const totalDebitos = debitos.reduce((acc, d) => acc + d.valor, 0);
    
    const { data, error } = await supabase.from("dctfweb_declaracoes").upsert({
      empresa_id: empresaId,
      competencia,
      status: "gerado",
      debitos,
      total_debitos: totalDebitos
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async calcularDebitos(empresaId: string, competencia: string): Promise<DebitoDCTF[]> {
    const { data: folhas } = await supabase.from("folha_pagamento")
      .select("*").eq("empresa_id", empresaId).eq("competencia", competencia);
    
    const totalINSS = (folhas || []).reduce((acc, f) => acc + (f.inss || 0), 0);
    const totalFGTS = (folhas || []).reduce((acc, f) => acc + (f.fgts || 0), 0);
    const baseCalculo = (folhas || []).reduce((acc, f) => acc + (f.valor_bruto || 0), 0);
    
    return [
      { tipo: "inss", codigoReceita: "1082-01", valor: totalINSS, competencia },
      { tipo: "terceiros", codigoReceita: "1082-02", valor: baseCalculo * 0.058, competencia },
      { tipo: "gilrat", codigoReceita: "1082-03", valor: baseCalculo * 0.02, competencia }
    ];
  },

  async transmitir(id: string): Promise<DeclaracaoDCTFWeb> {
    const { data, error } = await supabase.from("dctfweb_declaracoes")
      .update({ status: "transmitido", data_transmissao: new Date().toISOString() })
      .eq("id", id).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  getCodigosReceita(): Record<TipoDebito, string> {
    return {
      inss: "1082-01",
      terceiros: "1082-02",
      gilrat: "1082-03",
      pis: "8109-01",
      cofins: "2172-01",
      csll: "2372-01"
    };
  }
};

export default dctfwebServiceReal;
