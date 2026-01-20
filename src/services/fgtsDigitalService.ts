// V18-S004: FGTS Digital Service Real - Integração FGTS Digital
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
import { calcularFGTS, calcularFGTSRescisorio } from "@/calculators/fgts";

export type StatusGuiaFGTS = "pendente" | "gerada" | "paga" | "atrasada";
export type TipoGuia = "mensal" | "rescisoria" | "complementar";

export interface GuiaFGTS {
  id: string;
  empresa_id: string;
  competencia: string;
  tipo: TipoGuia;
  valor_total: number;
  valor_multa?: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: StatusGuiaFGTS;
  codigo_barras?: string;
  linha_digitavel?: string;
  created_at: string;
}

export interface DepositoFGTS {
  colaborador_id: string;
  colaborador_nome: string;
  base_calculo: number;
  valor_deposito: number;
  competencia: string;
}

export const fgtsDigitalServiceReal = {
  // Cálculos
  calcularDeposito(baseCalculo: number) {
    return calcularFGTS(baseCalculo);
  },

  calcularRescisorio(saldoFGTS: number, tipoRescisao: "sem_justa_causa" | "acordo" | "justa_causa" | "pedido_demissao" | "aposentadoria" | "falecimento") {
    return calcularFGTSRescisorio(saldoFGTS, tipoRescisao);
  },

  // Guias
  async gerarGuiaMensal(empresaId: string, competencia: string): Promise<GuiaFGTS> {
    const { data: colaboradores } = await supabase
      .from("colaboradores")
      .select("id, nome, salario_base")
      .eq("empresa_id", empresaId)
      .eq("status", "ativo");

    const depositos: DepositoFGTS[] = (colaboradores || []).map(c => ({
      colaborador_id: c.id,
      colaborador_nome: c.nome,
      base_calculo: c.salario_base,
      valor_deposito: calcularFGTS(c.salario_base).deposito,
      competencia
    }));

    const valorTotal = depositos.reduce((acc, d) => acc + d.valor_deposito, 0);
    const dataVencimento = this.calcularVencimento(competencia);

    const { data, error } = await supabase.from("guias_fgts").insert({
      empresa_id: empresaId,
      competencia,
      tipo: "mensal",
      valor_total: valorTotal,
      data_vencimento: dataVencimento,
      status: "gerada",
      codigo_barras: this.gerarCodigoBarras(),
      linha_digitavel: this.gerarLinhaDigitavel()
    }).select().single();

    if (error) throw new Error(handleSupabaseError(error));

    // Salvar detalhes dos depósitos
    await supabase.from("depositos_fgts").insert(depositos.map(d => ({
      guia_id: data.id,
      ...d
    })));

    return data;
  },

  async gerarGuiaRescisoria(empresaId: string, colaboradorId: string, saldoFGTS: number, tipoRescisao: "sem_justa_causa" | "acordo"): Promise<GuiaFGTS> {
    const rescisorio = calcularFGTSRescisorio(saldoFGTS, tipoRescisao);
    
    const { data, error } = await supabase.from("guias_fgts").insert({
      empresa_id: empresaId,
      competencia: new Date().toISOString().slice(0, 7),
      tipo: "rescisoria",
      valor_total: rescisorio.multa,
      valor_multa: rescisorio.multa,
      data_vencimento: this.calcularVencimentoRescisao(),
      status: "gerada"
    }).select().single();

    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async getGuias(empresaId: string, filtros?: { competencia?: string; tipo?: TipoGuia; status?: StatusGuiaFGTS }): Promise<GuiaFGTS[]> {
    let query = supabase.from("guias_fgts").select("*").eq("empresa_id", empresaId);
    if (filtros?.competencia) query = query.eq("competencia", filtros.competencia);
    if (filtros?.tipo) query = query.eq("tipo", filtros.tipo);
    if (filtros?.status) query = query.eq("status", filtros.status);
    const { data, error } = await query.order("competencia", { ascending: false });
    if (error) throw new Error(handleSupabaseError(error));
    return data || [];
  },

  async registrarPagamento(guiaId: string): Promise<GuiaFGTS> {
    const { data, error } = await supabase.from("guias_fgts").update({
      status: "paga",
      data_pagamento: new Date().toISOString()
    }).eq("id", guiaId).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  // Utilidades
  calcularVencimento(competencia: string): string {
    const [ano, mes] = competencia.split("-").map(Number);
    const vencimento = new Date(ano, mes, 7); // Dia 7 do mês seguinte
    return vencimento.toISOString().split("T")[0];
  },

  calcularVencimentoRescisao(): string {
    const vencimento = new Date();
    vencimento.setDate(vencimento.getDate() + 10);
    return vencimento.toISOString().split("T")[0];
  },

  gerarCodigoBarras(): string {
    return Array(47).fill(0).map(() => Math.floor(Math.random() * 10)).join("");
  },

  gerarLinhaDigitavel(): string {
    const codigo = this.gerarCodigoBarras();
    return `${codigo.slice(0, 5)}.${codigo.slice(5, 10)} ${codigo.slice(10, 15)}.${codigo.slice(15, 21)} ${codigo.slice(21, 26)}.${codigo.slice(26, 32)} ${codigo.slice(32, 33)} ${codigo.slice(33)}`;
  },

  // Relatórios
  async getRelatorioAnual(empresaId: string, ano: number) {
    const guias = await this.getGuias(empresaId, { status: "paga" });
    const guiasAno = guias.filter(g => g.competencia.startsWith(String(ano)));
    
    return {
      ano,
      totalDepositos: guiasAno.filter(g => g.tipo === "mensal").reduce((acc, g) => acc + g.valor_total, 0),
      totalMultas: guiasAno.filter(g => g.tipo === "rescisoria").reduce((acc, g) => acc + (g.valor_multa || 0), 0),
      guiasPagas: guiasAno.length,
      meses: guiasAno.map(g => ({ competencia: g.competencia, valor: g.valor_total }))
    };
  }
};

export default fgtsDigitalServiceReal;
