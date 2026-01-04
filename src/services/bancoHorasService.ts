import { supabase } from "@/integrations/supabase/client";

export interface BancoHoras {
  id: string;
  colaborador_id: string;
  saldo_atual: number;
  horas_credito: number;
  horas_debito: number;
  limite_acumulo: number;
  data_expiracao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface MovimentacaoBancoHoras {
  id: string;
  banco_horas_id: string;
  colaborador_id: string;
  tipo: "credito" | "debito" | "expiracao" | "compensacao" | "pagamento";
  horas: number;
  data_referencia: string;
  motivo: string;
  aprovador_id?: string;
  status: "pendente" | "aprovado" | "rejeitado";
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
      const { data, error } = await supabase.from("banco_horas").update({ ...dados, updated_at: new Date().toISOString() }).eq("id", existente.id).select().single();
      if (error) throw new Error(`Erro: ${error.message}`);
      return data;
    }
    const { data, error } = await supabase.from("banco_horas").insert([{ colaborador_id: colaboradorId, saldo_atual: 0, horas_credito: 0, horas_debito: 0, limite_acumulo: 120, ativo: true, ...dados }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async adicionarCredito(colaboradorId: string, horas: number, motivo: string, aprovadorId?: string): Promise<MovimentacaoBancoHoras> {
    const banco = await this.obterSaldo(colaboradorId) || await this.criarOuAtualizar(colaboradorId, {});
    const novoSaldo = banco.saldo_atual + horas;
    
    if (novoSaldo > banco.limite_acumulo) {
      throw new Error(`Limite de ${banco.limite_acumulo}h excedido`);
    }

    await this.criarOuAtualizar(colaboradorId, { saldo_atual: novoSaldo, horas_credito: banco.horas_credito + horas });
    
    const { data, error } = await supabase.from("movimentacoes_banco_horas").insert([{
      banco_horas_id: banco.id,
      colaborador_id: colaboradorId,
      tipo: "credito",
      horas,
      data_referencia: new Date().toISOString().split("T")[0],
      motivo,
      aprovador_id: aprovadorId,
      status: aprovadorId ? "aprovado" : "pendente"
    }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async utilizarHoras(colaboradorId: string, horas: number, motivo: string): Promise<MovimentacaoBancoHoras> {
    const banco = await this.obterSaldo(colaboradorId);
    if (!banco) throw new Error("Banco de horas não encontrado");
    if (banco.saldo_atual < horas) throw new Error("Saldo insuficiente");

    await this.criarOuAtualizar(colaboradorId, { saldo_atual: banco.saldo_atual - horas, horas_debito: banco.horas_debito + horas });

    const { data, error } = await supabase.from("movimentacoes_banco_horas").insert([{
      banco_horas_id: banco.id,
      colaborador_id: colaboradorId,
      tipo: "debito",
      horas,
      data_referencia: new Date().toISOString().split("T")[0],
      motivo,
      status: "aprovado"
    }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
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
        motivo: "Expiração automática do saldo",
        status: "aprovado"
      }]);
      await this.criarOuAtualizar(colaboradorId, { saldo_atual: 0 });
    }
  }

  async pagarHorasExtras(colaboradorId: string, horas: number): Promise<MovimentacaoBancoHoras> {
    const banco = await this.obterSaldo(colaboradorId);
    if (!banco) throw new Error("Banco de horas não encontrado");
    if (banco.saldo_atual < horas) throw new Error("Saldo insuficiente");

    await this.criarOuAtualizar(colaboradorId, { saldo_atual: banco.saldo_atual - horas });

    const { data, error } = await supabase.from("movimentacoes_banco_horas").insert([{
      banco_horas_id: banco.id,
      colaborador_id: colaboradorId,
      tipo: "pagamento",
      horas,
      data_referencia: new Date().toISOString().split("T")[0],
      motivo: "Pagamento de horas extras em folha",
      status: "aprovado"
    }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }
}

export const bancoHorasService = new BancoHorasService();
export default bancoHorasService;
