// V18-S007: DIRF Service Real Expandido - Declaracao Completa
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";

export type StatusDIRF = "pendente" | "gerando" | "gerado" | "validado" | "enviado" | "processado" | "erro";

export interface BeneficiarioDIRF {
  cpf: string;
  nome: string;
  rendimentosTributaveis: number;
  deducoesPrevidencia: number;
  irrfRetido: number;
  decimoTerceiro: number;
  irrfDecimo: number;
  outrosRendimentos?: number;
  dependentes: number;
}

export interface DeclaracaoDIRF {
  id: string;
  empresa_id: string;
  ano_calendario: number;
  status: StatusDIRF;
  arquivo_txt?: string;
  protocolo?: string;
  data_geracao?: string;
  data_envio?: string;
  total_beneficiarios: number;
  total_rendimentos: number;
  total_irrf: number;
  erros?: string[];
  created_at: string;
}

export interface ResumoDIRF {
  totalBeneficiarios: number;
  totalRendimentos: number;
  totalIRRF: number;
  totalPrevidencia: number;
  porFaixa: Record<string, { quantidade: number; valor: number }>;
}

export const dirfServiceReal = {
  // CRUD
  async criarDeclaracao(empresaId: string, anoCalendario: number): Promise<DeclaracaoDIRF> {
    const { data, error } = await supabase.from("dirf_declaracoes").insert({
      empresa_id: empresaId,
      ano_calendario: anoCalendario,
      status: "pendente",
      total_beneficiarios: 0,
      total_rendimentos: 0,
      total_irrf: 0
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async getDeclaracoes(empresaId: string): Promise<DeclaracaoDIRF[]> {
    const { data, error } = await supabase.from("dirf_declaracoes")
      .select("*").eq("empresa_id", empresaId)
      .order("ano_calendario", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async getDeclaracao(id: string): Promise<DeclaracaoDIRF | null> {
    const { data, error } = await supabase.from("dirf_declaracoes")
      .select("*").eq("id", id).single();
    if (error) return null;
    return data;
  },

  // Geracao
  async gerarDeclaracao(empresaId: string, anoCalendario: number): Promise<DeclaracaoDIRF> {
    const beneficiarios = await this.buscarBeneficiarios(empresaId, anoCalendario);
    const conteudo = this.gerarArquivoTXT(beneficiarios, anoCalendario);
    
    const totais = this.calcularTotais(beneficiarios);
    
    const { data, error } = await supabase.from("dirf_declaracoes").upsert({
      empresa_id: empresaId,
      ano_calendario: anoCalendario,
      status: "gerado",
      arquivo_txt: conteudo,
      data_geracao: new Date().toISOString(),
      total_beneficiarios: beneficiarios.length,
      total_rendimentos: totais.rendimentos,
      total_irrf: totais.irrf
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async buscarBeneficiarios(empresaId: string, anoCalendario: number): Promise<BeneficiarioDIRF[]> {
    const { data } = await supabase.from("folha_pagamento")
      .select("colaborador:colaboradores(cpf, nome), valor_bruto, inss, irrf, decimo13")
      .eq("empresa_id", empresaId)
      .gte("competencia", `${anoCalendario}-01`)
      .lte("competencia", `${anoCalendario}-12`);
    
    const agrupado = new Map<string, BeneficiarioDIRF>();
    
    (data || []).forEach(fp => {
      const cpf = fp.colaborador?.cpf || "";
      const atual = agrupado.get(cpf) || {
        cpf, nome: fp.colaborador?.nome || "",
        rendimentosTributaveis: 0, deducoesPrevidencia: 0,
        irrfRetido: 0, decimoTerceiro: 0, irrfDecimo: 0, dependentes: 0
      };
      
      atual.rendimentosTributaveis += fp.valor_bruto || 0;
      atual.deducoesPrevidencia += fp.inss || 0;
      atual.irrfRetido += fp.irrf || 0;
      atual.decimoTerceiro += fp.decimo13 || 0;
      
      agrupado.set(cpf, atual);
    });
    
    return Array.from(agrupado.values());
  },

  gerarArquivoTXT(beneficiarios: BeneficiarioDIRF[], ano: number): string {
    const linhas: string[] = [];
    linhas.push(`DIRF${ano}`);
    linhas.push("RESESSION");
    
    beneficiarios.forEach(b => {
      linhas.push(`BPFDEC|${b.cpf}|${b.nome}`);
      linhas.push(`RTRT|${b.rendimentosTributaveis.toFixed(2)}`);
      linhas.push(`RIDAC|${b.deducoesPrevidencia.toFixed(2)}`);
      linhas.push(`RIIRP|${b.irrfRetido.toFixed(2)}`);
      linhas.push(`RIP13|${b.decimoTerceiro.toFixed(2)}`);
      linhas.push(`FIM`);
    });
    
    linhas.push("FIMDIRF");
    return linhas.join("\n");
  },

  calcularTotais(beneficiarios: BeneficiarioDIRF[]): { rendimentos: number; irrf: number; previdencia: number } {
    return beneficiarios.reduce((acc, b) => ({
      rendimentos: acc.rendimentos + b.rendimentosTributaveis,
      irrf: acc.irrf + b.irrfRetido,
      previdencia: acc.previdencia + b.deducoesPrevidencia
    }), { rendimentos: 0, irrf: 0, previdencia: 0 });
  },

  // Resumo
  async getResumo(empresaId: string, anoCalendario: number): Promise<ResumoDIRF> {
    const beneficiarios = await this.buscarBeneficiarios(empresaId, anoCalendario);
    const totais = this.calcularTotais(beneficiarios);
    
    const porFaixa: Record<string, { quantidade: number; valor: number }> = {
      "ate5mil": { quantidade: 0, valor: 0 },
      "5a10mil": { quantidade: 0, valor: 0 },
      "acima10mil": { quantidade: 0, valor: 0 }
    };
    
    beneficiarios.forEach(b => {
      const mensal = b.rendimentosTributaveis / 12;
      if (mensal <= 5000) {
        porFaixa["ate5mil"].quantidade++;
        porFaixa["ate5mil"].valor += b.rendimentosTributaveis;
      } else if (mensal <= 10000) {
        porFaixa["5a10mil"].quantidade++;
        porFaixa["5a10mil"].valor += b.rendimentosTributaveis;
      } else {
        porFaixa["acima10mil"].quantidade++;
        porFaixa["acima10mil"].valor += b.rendimentosTributaveis;
      }
    });

    return {
      totalBeneficiarios: beneficiarios.length,
      totalRendimentos: totais.rendimentos,
      totalIRRF: totais.irrf,
      totalPrevidencia: totais.previdencia,
      porFaixa
    };
  },

  // Validacao
  validarBeneficiario(b: BeneficiarioDIRF): string[] {
    const erros: string[] = [];
    if (!b.cpf || b.cpf.length !== 11) erros.push("CPF invalido");
    if (!b.nome) erros.push("Nome obrigatorio");
    if (b.rendimentosTributaveis < 0) erros.push("Rendimentos nao pode ser negativo");
    if (b.irrfRetido < 0) erros.push("IRRF nao pode ser negativo");
    return erros;
  },

  async validarDeclaracao(id: string): Promise<{ valid: boolean; erros: string[] }> {
    const declaracao = await this.getDeclaracao(id);
    if (!declaracao) return { valid: false, erros: ["Declaracao nao encontrada"] };
    
    const beneficiarios = await this.buscarBeneficiarios(
      declaracao.empresa_id, declaracao.ano_calendario);
    
    const erros: string[] = [];
    beneficiarios.forEach((b, i) => {
      const errosB = this.validarBeneficiario(b);
      errosB.forEach(e => erros.push(`Beneficiario ${i+1}: ${e}`));
    });
    
    return { valid: erros.length === 0, erros };
  },

  // Informe de Rendimentos
  async gerarInformeRendimentos(empresaId: string, colaboradorId: string, ano: number): Promise<string> {
    const { data } = await supabase.from("folha_pagamento")
      .select("*")
      .eq("empresa_id", empresaId)
      .eq("colaborador_id", colaboradorId)
      .gte("competencia", `${ano}-01`)
      .lte("competencia", `${ano}-12`);
    
    const totais = (data || []).reduce((acc, fp) => ({
      rendimentos: acc.rendimentos + (fp.valor_bruto || 0),
      inss: acc.inss + (fp.inss || 0),
      irrf: acc.irrf + (fp.irrf || 0)
    }), { rendimentos: 0, inss: 0, irrf: 0 });

    return `INFORME DE RENDIMENTOS - ANO ${ano}\n` +
           `Rendimentos Tributaveis: R$ ${totais.rendimentos.toFixed(2)}\n` +
           `Contribuicao Previdenciaria: R$ ${totais.inss.toFixed(2)}\n` +
           `IRRF Retido: R$ ${totais.irrf.toFixed(2)}`;
  }
};

export default dirfServiceReal;
