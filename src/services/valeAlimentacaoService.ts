import { supabase } from "@/integrations/supabase/client";

export interface ValeAlimentacao {
  id: string;
  empresa_id: string;
  colaborador_id: string;
  tipo: "alimentacao" | "refeicao" | "flexivel";
  operadora: string;
  numero_cartao?: string;
  valor_mensal: number;
  valor_por_dia?: number;
  dias_uteis: number;
  percentual_empresa: number;
  percentual_colaborador: number;
  desconto_em_folha: boolean;
  ativo: boolean;
  data_inicio: string;
  data_fim?: string;
  created_at: string;
}

export interface RecargaVA {
  id: string;
  vale_alimentacao_id: string;
  colaborador_id: string;
  competencia: string;
  valor: number;
  data_recarga: string;
  status: "pendente" | "processada" | "cancelada";
}

class ValeAlimentacaoService {
  async listar(filtros?: { empresa_id?: string; colaborador_id?: string; ativo?: boolean }): Promise<ValeAlimentacao[]> {
    let query = supabase.from("vales_alimentacao").select("*");
    if (filtros?.empresa_id) query = query.eq("empresa_id", filtros.empresa_id);
    if (filtros?.colaborador_id) query = query.eq("colaborador_id", filtros.colaborador_id);
    if (filtros?.ativo !== undefined) query = query.eq("ativo", filtros.ativo);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async buscarPorId(id: string): Promise<ValeAlimentacao | null> {
    const { data, error } = await supabase.from("vales_alimentacao").select("*").eq("id", id).single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criar(va: Partial<ValeAlimentacao>): Promise<ValeAlimentacao> {
    const valorMensal = va.valor_por_dia ? va.valor_por_dia * (va.dias_uteis || 22) : va.valor_mensal || 0;
    
    const { data, error } = await supabase.from("vales_alimentacao").insert([{
      ...va,
      valor_mensal: valorMensal,
      dias_uteis: va.dias_uteis || 22,
      percentual_empresa: va.percentual_empresa || 100,
      percentual_colaborador: va.percentual_colaborador || 0,
      desconto_em_folha: va.desconto_em_folha ?? false,
      ativo: true,
      data_inicio: va.data_inicio || new Date().toISOString().split("T")[0]
    }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async atualizar(id: string, va: Partial<ValeAlimentacao>): Promise<ValeAlimentacao> {
    const { data, error } = await supabase.from("vales_alimentacao").update(va).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async desativar(id: string): Promise<void> {
    await supabase.from("vales_alimentacao").update({ ativo: false, data_fim: new Date().toISOString().split("T")[0] }).eq("id", id);
  }

  async gerarRecargaMensal(empresaId: string, competencia: string): Promise<RecargaVA[]> {
    const vas = await this.listar({ empresa_id: empresaId, ativo: true });
    const recargas: RecargaVA[] = [];

    for (const va of vas) {
      const { data, error } = await supabase.from("recargas_va").insert([{
        vale_alimentacao_id: va.id,
        colaborador_id: va.colaborador_id,
        competencia,
        valor: va.valor_mensal,
        data_recarga: new Date().toISOString().split("T")[0],
        status: "pendente"
      }]).select().single();
      
      if (!error && data) recargas.push(data);
    }

    return recargas;
  }

  async processarRecargas(competencia: string): Promise<void> {
    await supabase.from("recargas_va").update({ status: "processada" }).eq("competencia", competencia).eq("status", "pendente");
  }

  async calcularDescontoFolha(colaboradorId: string): Promise<number> {
    const vas = await this.listar({ colaborador_id: colaboradorId, ativo: true });
    return vas
      .filter(va => va.desconto_em_folha)
      .reduce((sum, va) => sum + (va.valor_mensal * (va.percentual_colaborador / 100)), 0);
  }

  async obterResumoEmpresa(empresaId: string): Promise<{ total_colaboradores: number; custo_mensal_empresa: number; custo_mensal_colaboradores: number }> {
    const vas = await this.listar({ empresa_id: empresaId, ativo: true });
    
    return {
      total_colaboradores: vas.length,
      custo_mensal_empresa: vas.reduce((sum, va) => sum + (va.valor_mensal * (va.percentual_empresa / 100)), 0),
      custo_mensal_colaboradores: vas.reduce((sum, va) => sum + (va.valor_mensal * (va.percentual_colaborador / 100)), 0)
    };
  }
}

export const valeAlimentacaoService = new ValeAlimentacaoService();
export default valeAlimentacaoService;
