import { supabase } from "@/integrations/supabase/client";

export interface RegistroPonto {
  id: string;
  colaborador_id: string;
  data: string;
  entrada1?: string;
  saida1?: string;
  entrada2?: string;
  saida2?: string;
  entrada3?: string;
  saida3?: string;
  horas_trabalhadas: number;
  horas_extras: number;
  horas_noturnas: number;
  atraso: number;
  falta: boolean;
  justificativa?: string;
  status: "pendente" | "aprovado" | "ajustado" | "rejeitado";
  localizacao?: { lat: number; lng: number };
  dispositivo?: string;
  ip?: string;
  created_at: string;
  updated_at: string;
}

export interface PontoFiltros {
  colaborador_id?: string;
  empresa_id?: string;
  data_inicio?: string;
  data_fim?: string;
  status?: string;
}

export interface BancoHoras {
  colaborador_id: string;
  saldo_horas: number;
  horas_credito: number;
  horas_debito: number;
  ultima_atualizacao: string;
}

class PontosService {
  private tableName = "registros_ponto";

  async listar(filtros?: PontoFiltros): Promise<RegistroPonto[]> {
    let query = supabase.from(this.tableName).select("*");

    if (filtros?.colaborador_id) {
      query = query.eq("colaborador_id", filtros.colaborador_id);
    }
    if (filtros?.data_inicio) {
      query = query.gte("data", filtros.data_inicio);
    }
    if (filtros?.data_fim) {
      query = query.lte("data", filtros.data_fim);
    }
    if (filtros?.status) {
      query = query.eq("status", filtros.status);
    }

    const { data, error } = await query.order("data", { ascending: false });
    if (error) throw new Error(`Erro ao listar pontos: ${error.message}`);
    return data || [];
  }

  async buscarPorId(id: string): Promise<RegistroPonto | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(`Erro ao buscar ponto: ${error.message}`);
    return data;
  }

  async registrarEntrada(colaboradorId: string, dados?: Partial<RegistroPonto>): Promise<RegistroPonto> {
    const agora = new Date();
    const data = agora.toISOString().split("T")[0];
    const hora = agora.toTimeString().split(" ")[0];

    // Verificar se já existe registro para hoje
    const { data: existente } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("colaborador_id", colaboradorId)
      .eq("data", data)
      .single();

    if (existente) {
      // Atualizar próxima entrada disponível
      const campo = !existente.entrada1 ? "entrada1" :
                   !existente.entrada2 ? "entrada2" :
                   !existente.entrada3 ? "entrada3" : null;
      
      if (!campo) throw new Error("Todas as entradas já foram registradas");

      return this.atualizar(existente.id, { [campo]: hora, ...dados });
    }

    // Criar novo registro
    const { data: novo, error } = await supabase
      .from(this.tableName)
      .insert([{
        colaborador_id: colaboradorId,
        data,
        entrada1: hora,
        horas_trabalhadas: 0,
        horas_extras: 0,
        horas_noturnas: 0,
        atraso: 0,
        falta: false,
        status: "pendente",
        ...dados
      }])
      .select()
      .single();

    if (error) throw new Error(`Erro ao registrar entrada: ${error.message}`);
    return novo;
  }

  async registrarSaida(colaboradorId: string, dados?: Partial<RegistroPonto>): Promise<RegistroPonto> {
    const agora = new Date();
    const data = agora.toISOString().split("T")[0];
    const hora = agora.toTimeString().split(" ")[0];

    const { data: existente } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("colaborador_id", colaboradorId)
      .eq("data", data)
      .single();

    if (!existente) throw new Error("Nenhuma entrada registrada hoje");

    const campo = existente.entrada1 && !existente.saida1 ? "saida1" :
                 existente.entrada2 && !existente.saida2 ? "saida2" :
                 existente.entrada3 && !existente.saida3 ? "saida3" : null;

    if (!campo) throw new Error("Nenhuma entrada pendente de saída");

    const atualizado = await this.atualizar(existente.id, { [campo]: hora, ...dados });
    
    // Recalcular horas
    return this.calcularHoras(atualizado.id);
  }

  async atualizar(id: string, ponto: Partial<RegistroPonto>): Promise<RegistroPonto> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ ...ponto, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar ponto: ${error.message}`);
    return data;
  }

  async excluir(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(`Erro ao excluir ponto: ${error.message}`);
  }

  async calcularHoras(id: string): Promise<RegistroPonto> {
    const ponto = await this.buscarPorId(id);
    if (!ponto) throw new Error("Ponto não encontrado");

    let totalMinutos = 0;
    let horasNoturnas = 0;

    const calcularIntervalo = (entrada?: string, saida?: string) => {
      if (!entrada || !saida) return 0;
      const [hE, mE] = entrada.split(":").map(Number);
      const [hS, mS] = saida.split(":").map(Number);
      return (hS * 60 + mS) - (hE * 60 + mE);
    };

    totalMinutos += calcularIntervalo(ponto.entrada1, ponto.saida1);
    totalMinutos += calcularIntervalo(ponto.entrada2, ponto.saida2);
    totalMinutos += calcularIntervalo(ponto.entrada3, ponto.saida3);

    const horasTrabalhadas = totalMinutos / 60;
    const jornadaDiaria = 8;
    const horasExtras = Math.max(0, horasTrabalhadas - jornadaDiaria);

    return this.atualizar(id, {
      horas_trabalhadas: horasTrabalhadas,
      horas_extras: horasExtras,
      horas_noturnas: horasNoturnas
    });
  }

  async aprovarPonto(id: string): Promise<RegistroPonto> {
    return this.atualizar(id, { status: "aprovado" });
  }

  async rejeitarPonto(id: string, motivo: string): Promise<RegistroPonto> {
    return this.atualizar(id, { status: "rejeitado", justificativa: motivo });
  }

  async ajustarPonto(id: string, ajustes: Partial<RegistroPonto>, justificativa: string): Promise<RegistroPonto> {
    const atualizado = await this.atualizar(id, { ...ajustes, justificativa, status: "ajustado" });
    return this.calcularHoras(atualizado.id);
  }

  async obterBancoHoras(colaboradorId: string): Promise<BancoHoras> {
    const { data } = await supabase
      .from("banco_horas")
      .select("*")
      .eq("colaborador_id", colaboradorId)
      .single();

    return data || {
      colaborador_id: colaboradorId,
      saldo_horas: 0,
      horas_credito: 0,
      horas_debito: 0,
      ultima_atualizacao: new Date().toISOString()
    };
  }

  async atualizarBancoHoras(colaboradorId: string, horas: number): Promise<BancoHoras> {
    const atual = await this.obterBancoHoras(colaboradorId);
    
    const novoSaldo = atual.saldo_horas + horas;
    const credito = horas > 0 ? atual.horas_credito + horas : atual.horas_credito;
    const debito = horas < 0 ? atual.horas_debito + Math.abs(horas) : atual.horas_debito;

    const { data, error } = await supabase
      .from("banco_horas")
      .upsert([{
        colaborador_id: colaboradorId,
        saldo_horas: novoSaldo,
        horas_credito: credito,
        horas_debito: debito,
        ultima_atualizacao: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw new Error(`Erro ao atualizar banco de horas: ${error.message}`);
    return data;
  }

  async gerarRelatorioMensal(colaboradorId: string, mes: string): Promise<{
    dias_trabalhados: number;
    total_horas: number;
    horas_extras: number;
    faltas: number;
    atrasos: number;
  }> {
    const [ano, mesNum] = mes.split("-");
    const dataInicio = `${ano}-${mesNum}-01`;
    const dataFim = new Date(Number(ano), Number(mesNum), 0).toISOString().split("T")[0];

    const pontos = await this.listar({
      colaborador_id: colaboradorId,
      data_inicio: dataInicio,
      data_fim: dataFim
    });

    return {
      dias_trabalhados: pontos.filter(p => !p.falta).length,
      total_horas: pontos.reduce((sum, p) => sum + p.horas_trabalhadas, 0),
      horas_extras: pontos.reduce((sum, p) => sum + p.horas_extras, 0),
      faltas: pontos.filter(p => p.falta).length,
      atrasos: pontos.reduce((sum, p) => sum + (p.atraso > 0 ? 1 : 0), 0)
    };
  }
}

export const pontosService = new PontosService();
export default pontosService;
