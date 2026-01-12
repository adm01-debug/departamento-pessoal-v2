// V18-S001: INSSService Real Expandido - Produção
import { calcularINSS, calcularINSSDetalhado, getTetoINSS, getTabelaINSS } from "@/calculators/inss";
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { TABELA_INSS_2026, TETO_INSS_2026, SALARIO_MINIMO_2026 } from "@/constants/tabelas.constants";

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
  salario: number;
  inss: number;
  aliquotaEfetiva: number;
  faixas: { faixa: number; base: number; aliquota: number; valor: number }[];
  liquido: number;
}

export const inssServiceReal = {
  // Cálculos básicos
  calcular: (salario: number) => calcularINSS(salario),
  calcularDetalhado: (salario: number) => calcularINSSDetalhado(salario),
  
  // Tabelas
  getTabela: () => TABELA_INSS_2026,
  getTeto: () => TETO_INSS_2026,
  getSalarioMinimo: () => SALARIO_MINIMO_2026,
  
  // Patronal (20%)
  calcularPatronal: (salario: number) => Math.round(salario * 0.20 * 100) / 100,
  
  // RAT/SAT (1% a 3%)
  calcularRAT: (salario: number, grauRisco: 1 | 2 | 3) => {
    const aliquotas = { 1: 0.01, 2: 0.02, 3: 0.03 };
    return Math.round(salario * aliquotas[grauRisco] * 100) / 100;
  },
  
  // Terceiros (5.8%)
  calcularTerceiros: (salario: number) => Math.round(salario * 0.058 * 100) / 100,
  
  // Total encargos empregador
  calcularTotalEncargos: (salario: number, grauRisco: 1 | 2 | 3 = 2) => {
    const patronal = salario * 0.20;
    const rat = salario * (grauRisco === 1 ? 0.01 : grauRisco === 2 ? 0.02 : 0.03);
    const terceiros = salario * 0.058;
    return Math.round((patronal + rat + terceiros) * 100) / 100;
  },
  
  // Simulação completa
  simular: (salario: number): SimulacaoINSS => {
    const detalhado = calcularINSSDetalhado(salario);
    return {
      salario,
      inss: detalhado.valor,
      aliquotaEfetiva: detalhado.aliquotaEfetiva,
      faixas: detalhado.faixasAplicadas,
      liquido: salario - detalhado.valor
    };
  },
  
  // Histórico
  async salvarHistorico(colaboradorId: string, competencia: string, baseCalculo: number) {
    const detalhado = calcularINSSDetalhado(baseCalculo);
    const { data, error } = await supabase.from("inss_historico").insert({
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
    let query = supabase.from("inss_historico").select("*").eq("colaborador_id", colaboradorId);
    if (ano) query = query.like("competencia", `${ano}%`);
    const { data, error } = await query.order("competencia", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  
  // Validações
  validarBaseCalculo: (valor: number) => ({
    valido: valor > 0 && valor <= TETO_INSS_2026,
    mensagem: valor <= 0 ? "Valor deve ser positivo" : valor > TETO_INSS_2026 ? `Valor excede teto INSS (${TETO_INSS_2026})` : "OK"
  }),
  
  // Cálculo em lote
  calcularLote: (salarios: number[]) => salarios.map(s => ({ salario: s, inss: calcularINSS(s) }))
};

export default inssServiceReal;
