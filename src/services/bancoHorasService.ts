import { supabase } from "@/integrations/supabase/client";

export interface BancoHoras {
  id: string;
  colaborador_id: string;
  saldo_atual: number;
  horas_credito: number;
  horas_debito: number;
  data_expiracao?: string;
  limite_acumulado: number;
  ativo: boolean;
  updated_at: string;
}

export interface MovimentacaoBancoHoras {
  id: string;
  banco_horas_id: string;
  colaborador_id: string;
  tipo: "credito" | "debito" | "ajuste" | "expiracao";
  horas: number;
  data_referencia: string;
  motivo: string;
  aprovador_id?: string;
  ponto_id?: string;
  created_at: string;
}

class BancoHorasService {
  async obterSaldo(colaboradorId: string): Promise<BancoHoras | null> {
    const { data, error } = await supabase.from("banco_horas").select("*").eq("colaborador_id", colaboradorId).single();
    if (error && error.code !== "PGRST116") throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criarOuAtualizar(colaboradorId: string, dados: Partial<BancoHoras>): Promise<BancoHoras> {
    const existente = await this.obterSaldo(colaboradorId);
    
    if (existente) {
      const { data, error } = await supabase
        .from("banco_horas")
        .update({ ...dados, updated_at: new Date().toISOString() })
        .eq("colaborador_id", colaboradorId)
        .select().single();
      if (error) throw new Error(`Erro: ${error.message}`);
      return data;
    }

    const { data, error } = await supabase
      .from("banco_horas")
      .insert([{ colaborador_id: colaboradorId, saldo_atual: 0, horas_credito: 0, horas_debito: 0, limite_acumulado: 120, ativo: true, ...dados }])
      .select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async adicionarCredito(colaboradorId: string, horas: number, motivo: string, aprovadorId?: string): Promise<BancoHoras> {
    const banco = await this.obterSaldo(colaboradorId) || await this.criarOuAtualizar(colaboradorId, {});
    
    if (banco.saldo_atual + horas > banco.limite_acumulado) {
      throw new Error(`Limite de ${banco.limite_acumulado} horas excedido`);
    }

    await supabase.from("movimentacoes_banco_horas").insert([{
      banco_horas_id: banco.id,
      colaborador_id: colaboradorId,
      tipo: "credito",
      horas,
      data_referencia: new Date().toISOString().split("T")[0],
      motivo,
      aprovador_id: aprovadorId
    }]);

    return this.criarOuAtualizar(colaboradorId, {
      saldo_atual: banco.saldo_atual + horas,
      horas_credito: banco.horas_credito + horas
    });
  }

  async utilizarHoras(colaboradorId: string, horas: number, motivo: string): Promise<BancoHoras> {
    const banco = await this.obterSaldo(colaboradorId);
    if (!banco) throw new Error("Banco de horas não encontrado");
    if (banco.saldo_atual < horas) throw new Error("Saldo insuficiente");

    await supabase.from("movimentacoes_banco_horas").insert([{
      banco_horas_id: banco.id,
      colaborador_id: colaboradorId,
      tipo: "debito",
      horas,
      data_referencia: new Date().toISOString().split("T")[0],
      motivo
    }]);

    return this.criarOuAtualizar(colaboradorId, {
      saldo_atual: banco.saldo_atual - horas,
      horas_debito: banco.horas_debito + horas
    });
  }

  async listarMovimentacoes(colaboradorId: string, filtros?: { data_inicio?: string; data_fim?: string }): Promise<MovimentacaoBancoHoras[]> {
    let query = supabase.from("movimentacoes_banco_horas").select("*").eq("colaborador_id", colaboradorId);
    if (filtros?.data_inicio) query = query.gte("data_referencia", filtros.data_inicio);
    if (filtros?.data_fim) query = query.lte("data_referencia", filtros.data_fim);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async processarExpiracao(colaboradorId: string): Promise<void> {
    const banco = await this.obterSaldo(colaboradorId);
    if (!banco || !banco.data_expiracao) return;

    const hoje = new Date();
    const expiracao = new Date(banco.data_expiracao);
    
    if (hoje > expiracao && banco.saldo_atual > 0) {
      await supabase.from("movimentacoes_banco_horas").insert([{
        banco_horas_id: banco.id,
        colaborador_id: colaboradorId,
        tipo: "expiracao",
        horas: banco.saldo_atual,
        data_referencia: new Date().toISOString().split("T")[0],
        motivo: "Expiração automática do banco de horas"
      }]);

      await this.criarOuAtualizar(colaboradorId, { saldo_atual: 0 });
    }
  }

  async obterRelatorio(empresaId: string): Promise<{ colaborador_id: string; nome: string; saldo: number }[]> {
    const { data, error } = await supabase
      .from("banco_horas")
      .select("colaborador_id, saldo_atual, colaboradores(nome)")
      .eq("colaboradores.empresa_id", empresaId);
    if (error) throw new Error(`Erro: ${error.message}`);
    return (data || []).map((d: any) => ({ colaborador_id: d.colaborador_id, nome: d.colaboradores?.nome, saldo: d.saldo_atual }));
  }
}

export const bancoHorasService = new BancoHorasService();
export default bancoHorasService;
