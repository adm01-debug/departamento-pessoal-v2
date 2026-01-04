import { supabase } from "@/integrations/supabase/client";

export interface ValeAlimentacao {
  id: string;
  colaborador_id: string;
  tipo: "alimentacao" | "refeicao" | "flex";
  operadora: string;
  numero_cartao?: string;
  valor_diario: number;
  dias_uteis_mes: number;
  valor_mensal: number;
  desconto_folha: number;
  percentual_desconto: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

class ValeAlimentacaoService {
  private tableName = "vales_alimentacao";

  async buscar(colaboradorId: string): Promise<ValeAlimentacao | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("colaborador_id", colaboradorId).single();
    if (error && error.code !== "PGRST116") throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criarOuAtualizar(colaboradorId: string, dados: Partial<ValeAlimentacao>): Promise<ValeAlimentacao> {
    const existente = await this.buscar(colaboradorId);
    
    const diasUteis = dados.dias_uteis_mes || 22;
    const valorMensal = (dados.valor_diario || 0) * diasUteis;
    const percentual = dados.percentual_desconto || 20;
    const desconto = valorMensal * (percentual / 100);

    const dadosCompletos = {
      ...dados,
      colaborador_id: colaboradorId,
      valor_mensal: valorMensal,
      desconto_folha: desconto,
      ativo: true
    };

    if (existente) {
      const { data, error } = await supabase
        .from(this.tableName)
        .update({ ...dadosCompletos, updated_at: new Date().toISOString() })
        .eq("colaborador_id", colaboradorId)
        .select().single();
      if (error) throw new Error(`Erro: ${error.message}`);
      return data;
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .insert([dadosCompletos])
      .select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async desativar(colaboradorId: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).update({ ativo: false }).eq("colaborador_id", colaboradorId);
    if (error) throw new Error(`Erro: ${error.message}`);
  }

  async calcularDescontoFolha(colaboradorId: string): Promise<number> {
    const va = await this.buscar(colaboradorId);
    if (!va || !va.ativo) return 0;
    return va.desconto_folha;
  }

  async listarPorEmpresa(empresaId: string): Promise<ValeAlimentacao[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*, colaboradores!inner(empresa_id, nome)")
      .eq("colaboradores.empresa_id", empresaId)
      .eq("ativo", true);
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async obterResumoEmpresa(empresaId: string): Promise<{ total_beneficiarios: number; custo_empresa: number; custo_colaborador: number }> {
    const vas = await this.listarPorEmpresa(empresaId);
    
    return {
      total_beneficiarios: vas.length,
      custo_empresa: vas.reduce((sum, v) => sum + v.valor_mensal - v.desconto_folha, 0),
      custo_colaborador: vas.reduce((sum, v) => sum + v.desconto_folha, 0)
    };
  }

  async recarregar(empresaId: string, competencia: string): Promise<{ total: number; colaboradores: number }> {
    const vas = await this.listarPorEmpresa(empresaId);
    let total = 0;
    
    for (const va of vas) {
      total += va.valor_mensal;
      await supabase.from("recargas_va").insert([{
        vale_alimentacao_id: va.id,
        competencia,
        valor: va.valor_mensal,
        status: "pendente"
      }]);
    }

    return { total, colaboradores: vas.length };
  }
}

export const valeAlimentacaoService = new ValeAlimentacaoService();
export default valeAlimentacaoService;
