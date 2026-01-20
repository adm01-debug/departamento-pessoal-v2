// V18-S006: RAIS Service Real Expandido - Geracao Arquivo RAIS
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";

export type StatusRAIS = "pendente" | "gerando" | "gerado" | "enviado" | "processado" | "erro";
export type TipoVinculo = "clt" | "estatutario" | "temporario" | "aprendiz" | "estagiario";

export interface ColaboradorRAIS {
  pis: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  dataAdmissao: string;
  dataDemissao?: string;
  cbo: string;
  remuneracaoMedia: number;
  remuneracaoMeses: number[];
  horasContratuais: number;
  tipoVinculo: TipoVinculo;
  motivoDesligamento?: string;
}

export interface ArquivoRAIS {
  id: string;
  empresa_id: string;
  ano_base: number;
  status: StatusRAIS;
  arquivo_txt?: string;
  protocolo_envio?: string;
  data_geracao?: string;
  data_envio?: string;
  total_colaboradores: number;
  erros?: string[];
  created_at: string;
}

export interface EstatisticasRAIS {
  totalVinculos: number;
  admissoes: number;
  demissoes: number;
  massaSalarial: number;
  porTipoVinculo: Record<TipoVinculo, number>;
}

export const raisServiceReal = {
  // CRUD
  async criarDeclaracao(empresaId: string, anoBase: number): Promise<ArquivoRAIS> {
    const { data, error } = await supabase.from("rais_declaracoes").insert({
      empresa_id: empresaId,
      ano_base: anoBase,
      status: "pendente",
      total_colaboradores: 0
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async getDeclaracoes(empresaId: string): Promise<ArquivoRAIS[]> {
    const { data, error } = await supabase.from("rais_declaracoes")
      .select("*").eq("empresa_id", empresaId)
      .order("ano_base", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async getDeclaracao(id: string): Promise<ArquivoRAIS | null> {
    const { data, error } = await supabase.from("rais_declaracoes")
      .select("*").eq("id", id).single();
    if (error) return null;
    return data;
  },

  // Geracao de Arquivo
  async gerarArquivo(empresaId: string, anoBase: number): Promise<ArquivoRAIS> {
    const colaboradores = await this.buscarColaboradoresRAIS(empresaId, anoBase);
    const conteudo = this.gerarConteudoTXT(colaboradores, anoBase);
    
    const { data, error } = await supabase.from("rais_declaracoes").upsert({
      empresa_id: empresaId,
      ano_base: anoBase,
      status: "gerado",
      arquivo_txt: conteudo,
      data_geracao: new Date().toISOString(),
      total_colaboradores: colaboradores.length
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async buscarColaboradoresRAIS(empresaId: string, anoBase: number): Promise<ColaboradorRAIS[]> {
    const { data } = await supabase.from("colaboradores")
      .select("*")
      .eq("empresa_id", empresaId)
      .or(`data_admissao.lte.${anoBase}-12-31,data_demissao.gte.${anoBase}-01-01`);
    
    return (data || []).map(c => ({
      pis: c.pis || "",
      nome: c.nome,
      cpf: c.cpf,
      dataNascimento: c.data_nascimento,
      dataAdmissao: c.data_admissao,
      dataDemissao: c.data_demissao,
      cbo: c.cbo || "000000",
      remuneracaoMedia: c.salario_base,
      remuneracaoMeses: Array(12).fill(c.salario_base),
      horasContratuais: c.carga_horaria || 220,
      tipoVinculo: "clt" as TipoVinculo
    }));
  },

  gerarConteudoTXT(colaboradores: ColaboradorRAIS[], anoBase: number): string {
    const linhas: string[] = [];
    linhas.push(`RAIS ANO BASE ${anoBase}`);
    linhas.push(`TOTAL VINCULOS: ${colaboradores.length}`);
    linhas.push("---");
    
    colaboradores.forEach((c, i) => {
      linhas.push(`${i+1}|${c.pis}|${c.cpf}|${c.nome}|${c.dataAdmissao}|${c.cbo}|${c.remuneracaoMedia}`);
    });
    
    return linhas.join("\n");
  },

  // Estatisticas
  async getEstatisticas(empresaId: string, anoBase: number): Promise<EstatisticasRAIS> {
    const colaboradores = await this.buscarColaboradoresRAIS(empresaId, anoBase);
    
    const admissoes = colaboradores.filter(c => 
      c.dataAdmissao.startsWith(String(anoBase))).length;
    const demissoes = colaboradores.filter(c => 
      c.dataDemissao?.startsWith(String(anoBase))).length;
    const massaSalarial = colaboradores.reduce((acc, c) => 
      acc + (c.remuneracaoMedia * 12), 0);
    
    const porTipoVinculo = colaboradores.reduce((acc, c) => {
      acc[c.tipoVinculo] = (acc[c.tipoVinculo] || 0) + 1;
      return acc;
    }, {} as Record<TipoVinculo, number>);

    return {
      totalVinculos: colaboradores.length,
      admissoes,
      demissoes,
      massaSalarial,
      porTipoVinculo
    };
  },

  // Validacao
  validarColaborador(colaborador: ColaboradorRAIS): string[] {
    const erros: string[] = [];
    if (!colaborador.pis || colaborador.pis.length !== 11) erros.push("PIS invalido");
    if (!colaborador.cpf || colaborador.cpf.length !== 11) erros.push("CPF invalido");
    if (!colaborador.cbo || colaborador.cbo.length !== 6) erros.push("CBO invalido");
    if (!colaborador.dataAdmissao) erros.push("Data admissao obrigatoria");
    return erros;
  },

  async validarDeclaracao(id: string): Promise<{ valid: boolean; erros: string[] }> {
    const declaracao = await this.getDeclaracao(id);
    if (!declaracao) return { valid: false, erros: ["Declaracao nao encontrada"] };
    
    const colaboradores = await this.buscarColaboradoresRAIS(
      declaracao.empresa_id, declaracao.ano_base);
    
    const erros: string[] = [];
    colaboradores.forEach((c, i) => {
      const errosCol = this.validarColaborador(c);
      errosCol.forEach(e => erros.push(`Colaborador ${i+1}: ${e}`));
    });
    
    return { valid: erros.length === 0, erros };
  }
};

export default raisServiceReal;
