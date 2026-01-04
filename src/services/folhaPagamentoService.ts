import { supabase } from "@/integrations/supabase/client";

export interface FolhaPagamento {
  id: string;
  empresa_id: string;
  colaborador_id: string;
  competencia: string;
  salario_base: number;
  horas_trabalhadas: number;
  horas_extras: number;
  valor_horas_extras: number;
  adicional_noturno: number;
  insalubridade: number;
  periculosidade: number;
  comissoes: number;
  gratificacoes: number;
  total_proventos: number;
  inss: number;
  irrf: number;
  vale_transporte: number;
  vale_alimentacao: number;
  plano_saude: number;
  outros_descontos: number;
  total_descontos: number;
  salario_liquido: number;
  fgts: number;
  status: "rascunho" | "calculada" | "aprovada" | "paga" | "cancelada";
  data_pagamento?: string;
  created_at: string;
  updated_at: string;
}

export interface FolhaFiltros {
  empresa_id?: string;
  colaborador_id?: string;
  competencia?: string;
  status?: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface ResumoFolha {
  total_colaboradores: number;
  total_proventos: number;
  total_descontos: number;
  total_liquido: number;
  total_fgts: number;
  total_inss_empresa: number;
}

class FolhaPagamentoService {
  private tableName = "folhas_pagamento";

  async listar(filtros?: FolhaFiltros): Promise<FolhaPagamento[]> {
    let query = supabase.from(this.tableName).select("*");

    if (filtros?.empresa_id) {
      query = query.eq("empresa_id", filtros.empresa_id);
    }
    if (filtros?.colaborador_id) {
      query = query.eq("colaborador_id", filtros.colaborador_id);
    }
    if (filtros?.competencia) {
      query = query.eq("competencia", filtros.competencia);
    }
    if (filtros?.status) {
      query = query.eq("status", filtros.status);
    }

    const { data, error } = await query.order("competencia", { ascending: false });

    if (error) throw new Error(`Erro ao listar folhas: ${error.message}`);
    return data || [];
  }

  async buscarPorId(id: string): Promise<FolhaPagamento | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(`Erro ao buscar folha: ${error.message}`);
    return data;
  }

  async criar(folha: Partial<FolhaPagamento>): Promise<FolhaPagamento> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([{ ...folha, status: "rascunho" }])
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar folha: ${error.message}`);
    return data;
  }

  async atualizar(id: string, folha: Partial<FolhaPagamento>): Promise<FolhaPagamento> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ ...folha, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar folha: ${error.message}`);
    return data;
  }

  async excluir(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(`Erro ao excluir folha: ${error.message}`);
  }

  async calcularFolha(colaboradorId: string, competencia: string): Promise<FolhaPagamento> {
    // Buscar dados do colaborador
    const { data: colaborador } = await supabase
      .from("colaboradores")
      .select("*")
      .eq("id", colaboradorId)
      .single();

    if (!colaborador) throw new Error("Colaborador não encontrado");

    const salarioBase = colaborador.salario || 0;
    
    // Calcular proventos
    const horasExtras = 0; // Buscar do ponto
    const valorHorasExtras = (salarioBase / 220) * 1.5 * horasExtras;
    const adicionalNoturno = 0;
    const insalubridade = colaborador.insalubridade ? salarioBase * 0.2 : 0;
    const periculosidade = colaborador.periculosidade ? salarioBase * 0.3 : 0;
    
    const totalProventos = salarioBase + valorHorasExtras + adicionalNoturno + insalubridade + periculosidade;

    // Calcular INSS
    const inss = this.calcularINSS(totalProventos);
    
    // Calcular IRRF
    const baseIRRF = totalProventos - inss;
    const irrf = this.calcularIRRF(baseIRRF, colaborador.dependentes || 0);

    // Descontos
    const valeTransporte = colaborador.vale_transporte ? salarioBase * 0.06 : 0;
    const valeAlimentacao = colaborador.vale_alimentacao || 0;
    const planoSaude = colaborador.plano_saude || 0;

    const totalDescontos = inss + irrf + valeTransporte + valeAlimentacao + planoSaude;
    const salarioLiquido = totalProventos - totalDescontos;
    const fgts = totalProventos * 0.08;

    const folhaCalculada: Partial<FolhaPagamento> = {
      empresa_id: colaborador.empresa_id,
      colaborador_id: colaboradorId,
      competencia,
      salario_base: salarioBase,
      horas_trabalhadas: 220,
      horas_extras: horasExtras,
      valor_horas_extras: valorHorasExtras,
      adicional_noturno: adicionalNoturno,
      insalubridade,
      periculosidade,
      comissoes: 0,
      gratificacoes: 0,
      total_proventos: totalProventos,
      inss,
      irrf,
      vale_transporte: valeTransporte,
      vale_alimentacao: valeAlimentacao,
      plano_saude: planoSaude,
      outros_descontos: 0,
      total_descontos: totalDescontos,
      salario_liquido: salarioLiquido,
      fgts,
      status: "calculada",
    };

    return this.criar(folhaCalculada);
  }

  private calcularINSS(salario: number): number {
    // Tabela INSS 2025
    if (salario <= 1412.00) return salario * 0.075;
    if (salario <= 2666.68) return 105.90 + (salario - 1412.00) * 0.09;
    if (salario <= 4000.03) return 218.82 + (salario - 2666.68) * 0.12;
    if (salario <= 7786.02) return 378.82 + (salario - 4000.03) * 0.14;
    return 908.85; // Teto
  }

  private calcularIRRF(base: number, dependentes: number): number {
    const deducaoDependente = 189.59 * dependentes;
    const baseCalculo = base - deducaoDependente;

    // Tabela IRRF 2025
    if (baseCalculo <= 2259.20) return 0;
    if (baseCalculo <= 2826.65) return baseCalculo * 0.075 - 169.44;
    if (baseCalculo <= 3751.05) return baseCalculo * 0.15 - 381.44;
    if (baseCalculo <= 4664.68) return baseCalculo * 0.225 - 662.77;
    return baseCalculo * 0.275 - 896.00;
  }

  async processarFolhaEmpresa(empresaId: string, competencia: string): Promise<FolhaPagamento[]> {
    const { data: colaboradores } = await supabase
      .from("colaboradores")
      .select("id")
      .eq("empresa_id", empresaId)
      .eq("status", "ativo");

    if (!colaboradores) return [];

    const folhas: FolhaPagamento[] = [];
    for (const colab of colaboradores) {
      const folha = await this.calcularFolha(colab.id, competencia);
      folhas.push(folha);
    }

    return folhas;
  }

  async aprovarFolha(id: string): Promise<FolhaPagamento> {
    return this.atualizar(id, { status: "aprovada" });
  }

  async pagarFolha(id: string, dataPagamento: string): Promise<FolhaPagamento> {
    return this.atualizar(id, { status: "paga", data_pagamento: dataPagamento });
  }

  async cancelarFolha(id: string): Promise<FolhaPagamento> {
    return this.atualizar(id, { status: "cancelada" });
  }

  async obterResumo(empresaId: string, competencia: string): Promise<ResumoFolha> {
    const folhas = await this.listar({ empresa_id: empresaId, competencia });

    return {
      total_colaboradores: folhas.length,
      total_proventos: folhas.reduce((sum, f) => sum + f.total_proventos, 0),
      total_descontos: folhas.reduce((sum, f) => sum + f.total_descontos, 0),
      total_liquido: folhas.reduce((sum, f) => sum + f.salario_liquido, 0),
      total_fgts: folhas.reduce((sum, f) => sum + f.fgts, 0),
      total_inss_empresa: folhas.reduce((sum, f) => sum + f.total_proventos * 0.20, 0),
    };
  }
}

export const folhaPagamentoService = new FolhaPagamentoService();
export default folhaPagamentoService;
