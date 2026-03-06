// @ts-nocheck
// V18-S005: CAGED Service Real - Geração de Arquivo
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";

export type TipoMovimentacao = "admissao" | "desligamento" | "transferencia";
export type StatusCAGED = "pendente" | "gerado" | "enviado" | "aceito" | "rejeitado";

export interface MovimentacaoCAGED {
  id: string;
  empresa_id: string;
  colaborador_id: string;
  tipo: TipoMovimentacao;
  data_movimentacao: string;
  competencia: string;
  status: StatusCAGED;
}

export interface ArquivoCAGED {
  id: string;
  empresa_id: string;
  competencia: string;
  conteudo: string;
  status: StatusCAGED;
  protocolo?: string;
  created_at: string;
}

export const cagedServiceReal = {
  // Movimentações
  async registrarAdmissao(empresaId: string, colaboradorId: string, dataAdmissao: string): Promise<MovimentacaoCAGED> {
    const competencia = dataAdmissao.slice(0, 7);
    const { data, error } = await supabase.from("movimentacoes_caged").insert({
      empresa_id: empresaId,
      colaborador_id: colaboradorId,
      tipo: "admissao",
      data_movimentacao: dataAdmissao,
      competencia,
      status: "pendente"
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async registrarDesligamento(empresaId: string, colaboradorId: string, dataDesligamento: string): Promise<MovimentacaoCAGED> {
    const competencia = dataDesligamento.slice(0, 7);
    const { data, error } = await supabase.from("movimentacoes_caged").insert({
      empresa_id: empresaId,
      colaborador_id: colaboradorId,
      tipo: "desligamento",
      data_movimentacao: dataDesligamento,
      competencia,
      status: "pendente"
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async getMovimentacoes(empresaId: string, competencia: string): Promise<MovimentacaoCAGED[]> {
    const { data, error } = await supabase.from("movimentacoes_caged").select("*").eq("empresa_id", empresaId).eq("competencia", competencia);
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  // Geração de Arquivo
  async gerarArquivo(empresaId: string, competencia: string): Promise<ArquivoCAGED> {
    const movimentacoes = await this.getMovimentacoes(empresaId, competencia);
    const { data: empresa } = await supabase.from("empresas").select("cnpj, razao_social").eq("id", empresaId).single();
    
    const linhas: string[] = [];
    linhas.push(this.gerarRegistroTipo1(empresa, competencia));
    
    for (const mov of movimentacoes) {
      const { data: colaborador } = await supabase.from("colaboradores").select("*").eq("id", mov.colaborador_id).single();
      if (colaborador) {
        linhas.push(this.gerarRegistroTipo2(colaborador, mov));
      }
    }
    
    linhas.push(this.gerarRegistroTipo9(movimentacoes.length));
    
    const conteudo = linhas.join("\r\n");
    
    const { data, error } = await supabase.from("arquivos_caged").insert({
      empresa_id: empresaId,
      competencia,
      conteudo,
      status: "gerado"
    }).select().single();
    
    if (error) throw new Error(handleSupabaseError(error));
    
    await supabase.from("movimentacoes_caged").update({ status: "gerado" }).eq("empresa_id", empresaId).eq("competencia", competencia);
    
    return data;
  },

  gerarRegistroTipo1(empresa: any, competencia: string): string {
    const cnpj = (empresa?.cnpj || "").replace(/\D/g, "").padStart(14, "0");
    const comp = competencia.replace("-", "");
    return `1${cnpj}${comp}`.padEnd(80, " ");
  },

  gerarRegistroTipo2(colaborador: any, mov: MovimentacaoCAGED): string {
    const cpf = (colaborador.cpf || "").replace(/\D/g, "").padStart(11, "0");
    const pis = (colaborador.pis || "").replace(/\D/g, "").padStart(11, "0");
    const data = mov.data_movimentacao.replace(/-/g, "");
    const tipo = mov.tipo === "admissao" ? "10" : "20";
    return `2${cpf}${pis}${data}${tipo}`.padEnd(80, " ");
  },

  gerarRegistroTipo9(totalRegistros: number): string {
    return `9${String(totalRegistros).padStart(6, "0")}`.padEnd(80, " ");
  },

  // Download
  async downloadArquivo(arquivoId: string): Promise<{ nome: string; conteudo: string }> {
    const { data, error } = await supabase.from("arquivos_caged").select("competencia, conteudo").eq("id", arquivoId).single();
    if (error) throw new Error(handleSupabaseError(error));
    return {
      nome: `CAGED_${data.competencia.replace("-", "")}.txt`,
      conteudo: data.conteudo
    };
  },

  // Relatórios
  async getResumoCompetencia(empresaId: string, competencia: string) {
    const movs = await this.getMovimentacoes(empresaId, competencia);
    return {
      competencia,
      admissoes: movs.filter(m => m.tipo === "admissao").length,
      desligamentos: movs.filter(m => m.tipo === "desligamento").length,
      total: movs.length
    };
  }
};

export default cagedServiceReal;
