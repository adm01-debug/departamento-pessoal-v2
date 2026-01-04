import { supabase } from "@/integrations/supabase/client";

export interface Transferencia {
  id: string;
  colaborador_id: string;
  tipo: "departamento" | "filial" | "cargo" | "cidade";
  departamento_origem_id?: string;
  departamento_destino_id?: string;
  filial_origem_id?: string;
  filial_destino_id?: string;
  cargo_origem_id?: string;
  cargo_destino_id?: string;
  cidade_origem?: string;
  cidade_destino?: string;
  data_solicitacao: string;
  data_efetivacao: string;
  motivo: string;
  adicional_transferencia?: number;
  ajuda_custo?: number;
  aprovador_id?: string;
  status: "pendente" | "aprovada" | "rejeitada" | "efetivada" | "cancelada";
  observacoes?: string;
  created_at: string;
}

class TransferenciaService {
  private tableName = "transferencias";

  async listar(filtros?: { colaborador_id?: string; status?: string; tipo?: string }): Promise<Transferencia[]> {
    let query = supabase.from(this.tableName).select("*");
    if (filtros?.colaborador_id) query = query.eq("colaborador_id", filtros.colaborador_id);
    if (filtros?.status) query = query.eq("status", filtros.status);
    if (filtros?.tipo) query = query.eq("tipo", filtros.tipo);
    const { data, error } = await query.order("data_solicitacao", { ascending: false });
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async buscarPorId(id: string): Promise<Transferencia | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criar(transferencia: Partial<Transferencia>): Promise<Transferencia> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([{ ...transferencia, status: "pendente" }])
      .select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async aprovar(id: string, aprovadorId: string): Promise<Transferencia> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "aprovada", aprovador_id: aprovadorId })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async rejeitar(id: string, motivo: string): Promise<Transferencia> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "rejeitada", observacoes: motivo })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async efetivar(id: string): Promise<Transferencia> {
    const transferencia = await this.buscarPorId(id);
    if (!transferencia) throw new Error("Transferência não encontrada");
    if (transferencia.status !== "aprovada") throw new Error("Transferência deve estar aprovada");

    const atualizacoes: Record<string, unknown> = {};
    if (transferencia.departamento_destino_id) atualizacoes.departamento_id = transferencia.departamento_destino_id;
    if (transferencia.filial_destino_id) atualizacoes.filial_id = transferencia.filial_destino_id;
    if (transferencia.cargo_destino_id) atualizacoes.cargo_id = transferencia.cargo_destino_id;
    if (transferencia.cidade_destino) atualizacoes.cidade = transferencia.cidade_destino;

    await supabase.from("colaboradores").update(atualizacoes).eq("id", transferencia.colaborador_id);

    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "efetivada" })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async cancelar(id: string, motivo: string): Promise<Transferencia> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ status: "cancelada", observacoes: motivo })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async calcularAdicionalTransferencia(salario: number, distanciaKm: number): Promise<number> {
    if (distanciaKm < 50) return 0;
    return salario * 0.25; // 25% do salário para transferências > 50km
  }

  async obterHistorico(colaboradorId: string): Promise<Transferencia[]> {
    return this.listar({ colaborador_id: colaboradorId });
  }
}

export const transferenciaService = new TransferenciaService();
export default transferenciaService;
