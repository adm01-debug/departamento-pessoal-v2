// V18-S002: IRRFService Real Expandido - Reforma IR 2026
import { calcularIRRF, calcularIRRFDetalhado, calcularBaseIRRF, getDeducaoDependente, getTabelaIRRF } from "@/calculators/irrf";
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { TABELA_IRRF_2026, DEDUCAO_DEPENDENTE_IRRF_2026 } from "@/constants/tabelas.constants";

export interface HistoricoIRRF {
  id: string;
  colaborador_id: string;
  competencia: string;
  base_calculo: number;
  valor_irrf: number;
  dependentes: number;
  isento: boolean;
  created_at: string;
}

export interface SimulacaoIRRF {
  salarioBruto: number;
  inss: number;
  baseCalculo: number;
  dependentes: number;
  irrf: number;
  aliquotaEfetiva: number;
  isento: boolean;
  liquido: number;
}

export const irrfServiceReal = {
  // Cálculos básicos
  calcular: (baseCalculo: number, dependentes?: number) => calcularIRRF(baseCalculo, dependentes),
  calcularDetalhado: (baseCalculo: number, dependentes?: number) => calcularIRRFDetalhado(baseCalculo, dependentes),
  calcularBase: (salarioBruto: number, inss: number, pensao?: number) => calcularBaseIRRF(salarioBruto, inss, pensao),
  
  // Tabelas e constantes
  getTabela: () => TABELA_IRRF_2026,
  getDeducaoDependente: () => DEDUCAO_DEPENDENTE_IRRF_2026,
  
  // Verificar isenção (Reforma IR 2026: até R$ 5.000)
  verificarIsencao: (baseCalculo: number, dependentes: number = 0) => {
    const deducao = dependentes * DEDUCAO_DEPENDENTE_IRRF_2026;
    const base = baseCalculo - deducao;
    return base <= 5000;
  },
  
  // Simulação completa
  simular: (salarioBruto: number, inss: number, dependentes: number = 0, pensao: number = 0): SimulacaoIRRF => {
    const baseCalculo = calcularBaseIRRF(salarioBruto, inss, pensao);
    const detalhado = calcularIRRFDetalhado(baseCalculo, dependentes);
    return {
      salarioBruto,
      inss,
      baseCalculo,
      dependentes,
      irrf: detalhado.valor,
      aliquotaEfetiva: detalhado.aliquotaEfetiva,
      isento: detalhado.isento,
      liquido: salarioBruto - inss - detalhado.valor - pensao
    };
  },
  
  // Cálculo anual (para informe rendimentos)
  calcularAnual: (rendimentosTributaveis: number, deducoes: number, dependentes: number = 0) => {
    const baseAnual = rendimentosTributaveis - deducoes - (dependentes * DEDUCAO_DEPENDENTE_IRRF_2026 * 12);
    const irrfAnual = calcularIRRF(baseAnual / 12) * 12;
    return { baseAnual, irrfAnual, isento: baseAnual <= 60000 };
  },
  
  // Histórico
  async salvarHistorico(colaboradorId: string, competencia: string, baseCalculo: number, dependentes: number) {
    const detalhado = calcularIRRFDetalhado(baseCalculo, dependentes);
    const { data, error } = await supabase.from("irrf_historico").insert({
      colaborador_id: colaboradorId,
      competencia,
      base_calculo: baseCalculo,
      valor_irrf: detalhado.valor,
      dependentes,
      isento: detalhado.isento
    }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  
  async getHistorico(colaboradorId: string, ano?: number): Promise<HistoricoIRRF[]> {
    let query = supabase.from("irrf_historico").select("*").eq("colaborador_id", colaboradorId);
    if (ano) query = query.like("competencia", `${ano}%`);
    const { data, error } = await query.order("competencia", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },
  
  // Informe de Rendimentos
  async gerarInformeRendimentos(colaboradorId: string, ano: number) {
    const historico = await this.getHistorico(colaboradorId, ano);
    const totalRendimentos = historico.reduce((acc, h) => acc + h.base_calculo, 0);
    const totalIRRF = historico.reduce((acc, h) => acc + h.valor_irrf, 0);
    return {
      ano,
      colaboradorId,
      rendimentosTributaveis: totalRendimentos,
      irrfRetido: totalIRRF,
      meses: historico.length
    };
  },
  
  // Validação
  validarBase: (valor: number) => ({ valido: valor >= 0, mensagem: valor < 0 ? "Valor não pode ser negativo" : "OK" }),
  
  // Cálculo em lote
  calcularLote: (bases: { base: number; dependentes: number }[]) => 
    bases.map(b => ({ ...b, irrf: calcularIRRF(b.base, b.dependentes) }))
};

export default irrfServiceReal;
