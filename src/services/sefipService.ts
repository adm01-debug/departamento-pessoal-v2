// V18-S009: SEFIP Service - Geracao Arquivo SEFIP/GFIP
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";

export type ModalidadeSEFIP = 0 | 1 | 9; // 0-Branco, 1-Declaratoria, 9-Confirmacao
export type CodigoRecolhimento = 115 | 150 | 155 | 650 | 660;

export interface ColaboradorSEFIP {
  pis: string;
  nome: string;
  admissao: string;
  categoria: number;
  remuneracao: number;
  movimentacao?: string;
}

export interface ArquivoSEFIP {
  id: string;
  empresa_id: string;
  competencia: string;
  modalidade: ModalidadeSEFIP;
  codigo_recolhimento: CodigoRecolhimento;
  arquivo_re?: string;
  total_colaboradores: number;
  total_remuneracao: number;
  total_fgts: number;
  status: string;
  created_at: string;
}

export const sefipServiceReal = {
  async criarArquivo(empresaId: string, competencia: string, modalidade: ModalidadeSEFIP = 1): Promise<ArquivoSEFIP> {
    const { data, error } = await supabase.from("sefip_arquivos").insert({
      empresa_id: empresaId,
      competencia,
      modalidade,
      codigo_recolhimento: 115,
      status: "pendente",
      total_colaboradores: 0,
      total_remuneracao: 0,
      total_fgts: 0
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async getArquivos(empresaId: string): Promise<ArquivoSEFIP[]> {
    const { data, error } = await supabase.from("sefip_arquivos")
      .select("*").eq("empresa_id", empresaId)
      .order("competencia", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async gerarArquivo(empresaId: string, competencia: string): Promise<ArquivoSEFIP> {
    const colaboradores = await this.buscarColaboradores(empresaId, competencia);
    const conteudo = this.gerarConteudoRE(colaboradores, competencia);
    
    const totalRem = colaboradores.reduce((acc, c) => acc + c.remuneracao, 0);
    const totalFGTS = totalRem * 0.08;
    
    const { data, error } = await supabase.from("sefip_arquivos").upsert({
      empresa_id: empresaId,
      competencia,
      modalidade: 1,
      codigo_recolhimento: 115,
      arquivo_re: conteudo,
      status: "gerado",
      total_colaboradores: colaboradores.length,
      total_remuneracao: totalRem,
      total_fgts: totalFGTS
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async buscarColaboradores(empresaId: string, competencia: string): Promise<ColaboradorSEFIP[]> {
    const { data } = await supabase.from("colaboradores")
      .select("pis, nome, data_admissao, salario_base, categoria_sefip")
      .eq("empresa_id", empresaId).eq("status", "ativo");
    
    return (data || []).map(c => ({
      pis: c.pis || "",
      nome: c.nome,
      admissao: c.data_admissao,
      categoria: c.categoria_sefip || 1,
      remuneracao: c.salario_base
    }));
  },

  gerarConteudoRE(colaboradores: ColaboradorSEFIP[], competencia: string): string {
    const linhas: string[] = [];
    const [ano, mes] = competencia.split("-");
    
    linhas.push(`00|SEFIP|${ano}${mes}|115|1`);
    
    colaboradores.forEach((c, i) => {
      linhas.push(`30|${c.pis}|${c.nome.padEnd(40).substring(0,40)}|${c.categoria}|${c.remuneracao.toFixed(2)}`);
    });
    
    const total = colaboradores.reduce((acc, c) => acc + c.remuneracao, 0);
    linhas.push(`90|${colaboradores.length}|${total.toFixed(2)}|${(total * 0.08).toFixed(2)}`);
    
    return linhas.join("\n");
  },

  getCodigosRecolhimento(): Record<CodigoRecolhimento, string> {
    return {
      115: "Recolhimento ao FGTS e Declaracao a Previdencia",
      150: "Recolhimento ao FGTS e Declaracao a Previdencia de empregador domestico",
      155: "Recolhimento FGTS de empregador domestico",
      650: "Declaracao ao FGTS e a Previdencia",
      660: "Recolhimento exclusivo ao FGTS"
    };
  }
};

export default sefipServiceReal;
