// QA-FIX: FGTSService Real Implementation
import { supabase } from "@/integrations/supabase/client";
import { ALIQUOTA_FGTS_2026, MULTA_FGTS_DEMISSAO_SEM_JUSTA_CAUSA_2026 } from "@/config/tabelasTrabalhistas2026";

export interface FGTSData {
  id: string;
  colaboradorId: string;
  competencia: string;
  baseCalculo: number;
  valorFGTS: number;
  valorDepositado?: number;
  dataDeposito?: Date;
  status: "pendente" | "depositado" | "atrasado";
}

export class FGTSServiceReal {
  private aliquota = ALIQUOTA_FGTS_2026;
  private multaDemissao = MULTA_FGTS_DEMISSAO_SEM_JUSTA_CAUSA_2026;

  async calcular(baseCalculo: number): Promise<number> {
    return baseCalculo * (this.aliquota / 100);
  }

  async calcularMultaRescisoria(saldoFGTS: number, tipoRescisao: string): Promise<number> {
    if (tipoRescisao === "sem_justa_causa") {
      return saldoFGTS * (this.multaDemissao / 100);
    }
    if (tipoRescisao === "culpa_reciproca") {
      return saldoFGTS * 0.20;
    }
    return 0;
  }

  async listarPorColaborador(colaboradorId: string): Promise<FGTSData[]> {
    const { data, error } = await supabase
      .from("fgts")
      .select("*")
      .eq("colaborador_id", colaboradorId)
      .order("competencia", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async registrarDeposito(id: string, valorDepositado: number): Promise<FGTSData> {
    const { data, error } = await supabase
      .from("fgts")
      .update({
        valor_depositado: valorDepositado,
        data_deposito: new Date().toISOString(),
        status: "depositado"
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async gerarGuiaFGTS(competencia: string, empresaId: string) {
    const { data, error } = await supabase
      .from("fgts")
      .select("*, colaboradores(*)")
      .eq("competencia", competencia)
      .eq("colaboradores.empresa_id", empresaId);
    if (error) throw error;
    return {
      competencia,
      totalFGTS: data?.reduce((sum, item) => sum + (item.valorFGTS || 0), 0) || 0,
      registros: data || []
    };
  }

  async consultarSaldo(colaboradorId: string): Promise<number> {
    const { data, error } = await supabase
      .from("fgts")
      .select("valor_depositado")
      .eq("colaborador_id", colaboradorId)
      .eq("status", "depositado");
    if (error) throw error;
    return data?.reduce((sum, item) => sum + (item.valor_depositado || 0), 0) || 0;
  }
}

export const fgtsServiceReal = new FGTSServiceReal();
export default fgtsServiceReal;
