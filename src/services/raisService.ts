// V18-S006: RAIS Service Real - Geração de Arquivo Anual
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";

export type StatusRAIS = "pendente" | "gerado" | "enviado" | "aceito" | "retificado";

export interface ArquivoRAIS {
  id: string;
  empresa_id: string;
  ano_base: number;
  conteudo: string;
  status: StatusRAIS;
  protocolo?: string;
  created_at: string;
}

export const raisServiceReal = {
  async gerarArquivo(empresaId: string, anoBase: number): Promise<ArquivoRAIS> {
    const { data: empresa } = await supabase.from("empresas").select("*").eq("id", empresaId).single();
    const { data: colaboradores } = await supabase.from("colaboradores").select("*").eq("empresa_id", empresaId);
    
    const linhas: string[] = [];
    linhas.push(this.gerarHeader(empresa, anoBase));
    
    for (const col of colaboradores || []) {
      linhas.push(this.gerarRegistroColaborador(col, anoBase));
    }
    
    linhas.push(this.gerarTrailer(colaboradores?.length || 0));
    
    const { data, error } = await supabase.from("arquivos_rais").insert({
      empresa_id: empresaId,
      ano_base: anoBase,
      conteudo: linhas.join("\r\n"),
      status: "gerado"
    }).select().single();
    
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  gerarHeader(empresa: any, anoBase: number): string {
    const cnpj = (empresa?.cnpj || "").replace(/\D/g, "").padStart(14, "0");
    return `RAIS${anoBase}${cnpj}`.padEnd(200, " ");
  },

  gerarRegistroColaborador(col: any, anoBase: number): string {
    const cpf = (col.cpf || "").replace(/\D/g, "").padStart(11, "0");
    const pis = (col.pis || "").replace(/\D/g, "").padStart(11, "0");
    return `COL${cpf}${pis}${String(col.salario_base || 0).padStart(10, "0")}`.padEnd(200, " ");
  },

  gerarTrailer(total: number): string {
    return `FIM${String(total).padStart(6, "0")}`.padEnd(200, " ");
  },

  async getArquivos(empresaId: string): Promise<ArquivoRAIS[]> {
    const { data, error } = await supabase.from("arquivos_rais").select("*").eq("empresa_id", empresaId).order("ano_base", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async downloadArquivo(arquivoId: string): Promise<{ nome: string; conteudo: string }> {
    const { data, error } = await supabase.from("arquivos_rais").select("ano_base, conteudo").eq("id", arquivoId).single();
    if (error) throw new Error(handleSupabaseError(error));
    return { nome: `RAIS_${data.ano_base}.txt`, conteudo: data.conteudo };
  }
};

export default raisServiceReal;
