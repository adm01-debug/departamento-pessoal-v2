// V18-S002: IRRF Service Real Expandido - Cálculo Anual e Informe
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { calcularIRRF, calcularIRRFDetalhado, calcularBaseIRRF, getDeducaoDependente, getTabelaIRRF } from "@/calculators/irrf";

export interface HistoricoIRRF {
  id: string;
  colaborador_id: string;
  competencia: string;
  base_calculo: number;
  valor_irrf: number;
  dependentes: number;
  created_at: string;
}

export interface InformeRendimentos {
  ano: number;
  colaborador: { nome: string; cpf: string };
  empresa: { razao_social: string; cnpj: string };
  rendimentos: {
    totalRendimentos: number;
    totalINSS: number;
    totalIRRF: number;
    dependentes: number;
    pensaoAlimenticia: number;
  };
  meses: Array<{ competencia: string; rendimento: number; inss: number; irrf: number }>;
}

export const irrfServiceReal = {
  // Cálculos
  calcular(baseCalculo: number, dependentes: number = 0): number {
    return calcularIRRF(baseCalculo, dependentes);
  },

  calcularDetalhado(baseCalculo: number, dependentes: number = 0) {
    return calcularIRRFDetalhado(baseCalculo, dependentes);
  },

  calcularBase(salarioBruto: number, inss: number, pensaoAlimenticia: number = 0): number {
    return calcularBaseIRRF(salarioBruto, inss, pensaoAlimenticia);
  },

  simularAnual(salarioMensal: number, dependentes: number = 0) {
    const meses: Array<{ mes: number; irrf: number }> = [];
    let totalIRRF = 0;
    for (let i = 1; i <= 12; i++) {
      const irrf = calcularIRRF(salarioMensal, dependentes);
      meses.push({ mes: i, irrf });
      totalIRRF += irrf;
    }
    return { meses, totalIRRF, mediaIRRF: totalIRRF / 12 };
  },

  // Histórico
  async salvarHistorico(colaboradorId: string, competencia: string, baseCalculo: number, dependentes: number = 0): Promise<HistoricoIRRF> {
    const valorIrrf = calcularIRRF(baseCalculo, dependentes);
    const { data, error } = await supabase.from("historico_irrf").insert({
      colaborador_id: colaboradorId,
      competencia,
      base_calculo: baseCalculo,
      valor_irrf: valorIrrf,
      dependentes
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async getHistorico(colaboradorId: string, ano?: number): Promise<HistoricoIRRF[]> {
    let query = supabase.from("historico_irrf").select("*").eq("colaborador_id", colaboradorId);
    if (ano) query = query.like("competencia", `${ano}%`);
    const { data, error } = await query.order("competencia", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  // Informe de Rendimentos
  async gerarInformeRendimentos(colaboradorId: string, ano: number): Promise<InformeRendimentos> {
    const { data: colaborador } = await supabase.from("colaboradores").select("nome, cpf, empresa_id").eq("id", colaboradorId).single();
    if (!colaborador) throw new Error("Colaborador não encontrado");

    const { data: empresa } = await supabase.from("empresas").select("razao_social, cnpj").eq("id", colaborador.empresa_id).single();
    if (!empresa) throw new Error("Empresa não encontrada");

    const historicoIRRF = await this.getHistorico(colaboradorId, ano);
    
    const { data: historicoINSS } = await supabase
      .from("historico_inss")
      .select("competencia, valor_inss")
      .eq("colaborador_id", colaboradorId)
      .like("competencia", `${ano}%`);

    const meses = historicoIRRF.map(h => ({
      competencia: h.competencia,
      rendimento: h.base_calculo + (historicoINSS?.find(i => i.competencia === h.competencia)?.valor_inss || 0),
      inss: historicoINSS?.find(i => i.competencia === h.competencia)?.valor_inss || 0,
      irrf: h.valor_irrf
    }));

    return {
      ano,
      colaborador: { nome: colaborador.nome, cpf: colaborador.cpf },
      empresa: { razao_social: empresa.razao_social, cnpj: empresa.cnpj },
      rendimentos: {
        totalRendimentos: meses.reduce((acc, m) => acc + m.rendimento, 0),
        totalINSS: meses.reduce((acc, m) => acc + m.inss, 0),
        totalIRRF: meses.reduce((acc, m) => acc + m.irrf, 0),
        dependentes: historicoIRRF[0]?.dependentes || 0,
        pensaoAlimenticia: 0
      },
      meses
    };
  },

  // Utilidades
  getDeducaoDependente(): number {
    return getDeducaoDependente();
  },

  getTabela() {
    return getTabelaIRRF();
  },

  isIsento(baseCalculo: number, dependentes: number = 0): boolean {
    return calcularIRRF(baseCalculo, dependentes) === 0;
  },

  // DARF
  async gerarDARF(empresaId: string, competencia: string) {
    const { data: colaboradores } = await supabase
      .from("colaboradores")
      .select("id, salario_base")
      .eq("empresa_id", empresaId)
      .eq("status", "ativo");

    const valorTotal = (colaboradores || []).reduce((acc, c) => {
      const inss = 0; // Simplificado
      const base = calcularBaseIRRF(c.salario_base, inss);
      return acc + calcularIRRF(base);
    }, 0);

    return {
      competencia,
      codigoReceita: "0561",
      valorPrincipal: valorTotal,
      dataVencimento: this.calcularVencimentoDARF(competencia),
      cnpj: ""
    };
  },

  calcularVencimentoDARF(competencia: string): string {
    const [ano, mes] = competencia.split("-").map(Number);
    const vencimento = new Date(ano, mes, 20);
    return vencimento.toISOString().split("T")[0];
  }
};

export default irrfServiceReal;
