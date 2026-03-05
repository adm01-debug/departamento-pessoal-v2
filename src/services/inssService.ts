// @ts-nocheck
// V18-S001: INSS Service Real Expandido - Integração e Cálculos
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { calcularINSS, calcularINSSDetalhado, getTetoINSS, getTabelaINSS } from "@/calculators/inss";

export interface HistoricoINSS {
  id: string;
  colaborador_id: string;
  competencia: string;
  base_calculo: number;
  valor_inss: number;
  aliquota_efetiva: number;
  created_at: string;
}

export interface SimulacaoINSS {
  salarioBruto: number;
  inss: number;
  aliquotaEfetiva: number;
  faixasAplicadas: Array<{ faixa: number; base: number; aliquota: number; valor: number }>;
  tetoAplicado: boolean;
}

export interface GuiaINSS {
  id: string;
  empresa_id: string;
  competencia: string;
  valor_total: number;
  data_vencimento: string;
  status: "pendente" | "pago" | "atrasado";
  codigo_barras?: string;
}

export const inssServiceReal = {
  // Cálculos
  calcular(salarioBruto: number): number {
    return calcularINSS(salarioBruto);
  },

  calcularDetalhado(salarioBruto: number) {
    return calcularINSSDetalhado(salarioBruto);
  },

  simular(salarios: number[]): SimulacaoINSS[] {
    return salarios.map(salario => {
      const detalhado = calcularINSSDetalhado(salario);
      return {
        salarioBruto: salario,
        inss: detalhado.valor,
        aliquotaEfetiva: detalhado.aliquotaEfetiva,
        faixasAplicadas: detalhado.faixasAplicadas,
        tetoAplicado: salario > getTetoINSS()
      };
    });
  },

  // Histórico
  async salvarHistorico(colaboradorId: string, competencia: string, baseCalculo: number): Promise<HistoricoINSS> {
    const detalhado = calcularINSSDetalhado(baseCalculo);
    const { data, error } = await supabase.from("historico_inss").insert({
      colaborador_id: colaboradorId,
      competencia,
      base_calculo: baseCalculo,
      valor_inss: detalhado.valor,
      aliquota_efetiva: detalhado.aliquotaEfetiva
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async getHistorico(colaboradorId: string, ano?: number): Promise<HistoricoINSS[]> {
    let query = supabase.from("historico_inss").select("*").eq("colaborador_id", colaboradorId);
    if (ano) query = query.like("competencia", `${ano}%`);
    const { data, error } = await query.order("competencia", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async getTotalAno(colaboradorId: string, ano: number): Promise<{ total: number; meses: number }> {
    const historico = await this.getHistorico(colaboradorId, ano);
    return {
      total: historico.reduce((acc, h) => acc + h.valor_inss, 0),
      meses: historico.length
    };
  },

  // Guias
  async gerarGuia(empresaId: string, competencia: string): Promise<GuiaINSS> {
    const colaboradores = await supabase.from("colaboradores").select("id, salario_base").eq("empresa_id", empresaId).eq("status", "ativo");
    if (colaboradores.error) throw new Error(handleSupabaseError(colaboradores.error));
    
    const valorTotal = (colaboradores.data || []).reduce((acc, c) => acc + calcularINSS(c.salario_base), 0);
    const dataVencimento = this.calcularVencimento(competencia);
    
    const { data, error } = await supabase.from("guias_inss").insert({
      empresa_id: empresaId,
      competencia,
      valor_total: valorTotal,
      data_vencimento: dataVencimento,
      status: "pendente"
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async getGuias(empresaId: string, ano?: number): Promise<GuiaINSS[]> {
    let query = supabase.from("guias_inss").select("*").eq("empresa_id", empresaId);
    if (ano) query = query.like("competencia", `${ano}%`);
    const { data, error } = await query.order("competencia", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  // Utilidades
  calcularVencimento(competencia: string): string {
    const [ano, mes] = competencia.split("-").map(Number);
    const vencimento = new Date(ano, mes, 20); // Dia 20 do mês seguinte
    return vencimento.toISOString().split("T")[0];
  },

  getTeto(): number {
    return getTetoINSS();
  },

  getTabela() {
    return getTabelaINSS();
  },

  // Relatórios
  async getRelatorioMensal(empresaId: string, competencia: string) {
    const { data: colaboradores } = await supabase
      .from("colaboradores")
      .select("id, nome, cpf, salario_base")
      .eq("empresa_id", empresaId)
      .eq("status", "ativo");
    
    const detalhes = (colaboradores || []).map(c => ({
      colaborador: c.nome,
      cpf: c.cpf,
      salario: c.salario_base,
      ...calcularINSSDetalhado(c.salario_base)
    }));

    return {
      competencia,
      totalColaboradores: detalhes.length,
      totalINSS: detalhes.reduce((acc, d) => acc + d.valor, 0),
      detalhes
    };
  }
};

export default inssServiceReal;
