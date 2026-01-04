import { supabase } from "@/integrations/supabase/client";

export interface Transferencia {
  id: string;
  colaborador_id: string;
  tipo: "departamento" | "filial" | "cargo" | "unidade";
  origem_departamento_id?: string;
  destino_departamento_id?: string;
  origem_filial_id?: string;
  destino_filial_id?: string;
  origem_cargo_id?: string;
  destino_cargo_id?: string;
  data_solicitacao: string;
  data_efetivacao: string;
  motivo: string;
  solicitante_id: string;
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
    const { data, error } = await supabase.from(this.tableName).insert([{
      ...transferencia,
      data_solicitacao: new Date().toISOString().split("T")[0],
      status: "pendente"
    }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async aprovar(id: string, aprovadorId: string): Promise<Transferencia> {
    const { data, error } = await supabase.from(this.tableName).update({
      status: "aprovada",
      aprovador_id: aprovadorId
    }).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async rejeitar(id: string, motivo: string): Promise<Transferencia> {
    const { data, error } = await supabase.from(this.tableName).update({
      status: "rejeitada",
      observacoes: motivo
    }).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async efetivar(id: string): Promise<Transferencia> {
    const transferencia = await this.buscarPorId(id);
    if (!transferencia) throw new Error("Transferência não encontrada");
    if (transferencia.status !== "aprovada") throw new Error("Transferência deve estar aprovada");

    const atualizacao: Record<string, unknown> = {};
    if (transferencia.destino_departamento_id) atualizacao.departamento_id = transferencia.destino_departamento_id;
    if (transferencia.destino_cargo_id) atualizacao.cargo_id = transferencia.destino_cargo_id;
    if (transferencia.destino_filial_id) atualizacao.filial_id = transferencia.destino_filial_id;

    if (Object.keys(atualizacao).length > 0) {
      await supabase.from("colaboradores").update(atualizacao).eq("id", transferencia.colaborador_id);
    }

    const { data, error } = await supabase.from(this.tableName).update({ status: "efetivada" }).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async cancelar(id: string, motivo: string): Promise<Transferencia> {
    const { data, error } = await supabase.from(this.tableName).update({
      status: "cancelada",
      observacoes: motivo
    }).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async obterHistorico(colaboradorId: string): Promise<Transferencia[]> {
    return this.listar({ colaborador_id: colaboradorId });
  }
}

export const transferenciaService = new TransferenciaService();
export default transferenciaService;
