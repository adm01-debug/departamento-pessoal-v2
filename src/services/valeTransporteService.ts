import { supabase } from "@/integrations/supabase/client";

export interface ValeTransporte {
  id: string;
  colaborador_id: string;
  optante: boolean;
  valor_diario: number;
  dias_uteis_mes: number;
  valor_mensal: number;
  desconto_folha: number;
  linhas: { tipo: string; empresa: string; valor: number }[];
  endereco_origem: string;
  endereco_destino: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

class ValeTransporteService {
  private tableName = "vales_transporte";

  async buscar(colaboradorId: string): Promise<ValeTransporte | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("colaborador_id", colaboradorId).single();
    if (error && error.code !== "PGRST116") throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criarOuAtualizar(colaboradorId: string, dados: Partial<ValeTransporte>): Promise<ValeTransporte> {
    const existente = await this.buscar(colaboradorId);
    
    const valorDiario = dados.linhas?.reduce((sum, l) => sum + l.valor, 0) || 0;
    const diasUteis = dados.dias_uteis_mes || 22;
    const valorMensal = valorDiario * diasUteis * 2; // ida e volta

    // Desconto máximo 6% do salário
    const { data: colaborador } = await supabase.from("colaboradores").select("salario").eq("id", colaboradorId).single();
    const descontoMaximo = colaborador ? colaborador.salario * 0.06 : 0;
    const desconto = Math.min(valorMensal, descontoMaximo);

    const dadosCompletos = {
      ...dados,
      colaborador_id: colaboradorId,
      valor_diario: valorDiario,
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
    const { error } = await supabase.from(this.tableName).update({ ativo: false, optante: false }).eq("colaborador_id", colaboradorId);
    if (error) throw new Error(`Erro: ${error.message}`);
  }

  async calcularDescontoFolha(colaboradorId: string): Promise<number> {
    const vt = await this.buscar(colaboradorId);
    if (!vt || !vt.optante || !vt.ativo) return 0;
    return vt.desconto_folha;
  }

  async listarPorEmpresa(empresaId: string): Promise<ValeTransporte[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*, colaboradores!inner(empresa_id)")
      .eq("colaboradores.empresa_id", empresaId)
      .eq("ativo", true);
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async obterResumoEmpresa(empresaId: string): Promise<{ total_optantes: number; custo_total: number; desconto_total: number }> {
    const vts = await this.listarPorEmpresa(empresaId);
    const optantes = vts.filter(v => v.optante);
    
    return {
      total_optantes: optantes.length,
      custo_total: optantes.reduce((sum, v) => sum + v.valor_mensal, 0),
      desconto_total: optantes.reduce((sum, v) => sum + v.desconto_folha, 0)
    };
  }

  async recalcularTodos(empresaId: string, diasUteis: number): Promise<void> {
    const vts = await this.listarPorEmpresa(empresaId);
    for (const vt of vts) {
      await this.criarOuAtualizar(vt.colaborador_id, { ...vt, dias_uteis_mes: diasUteis });
    }
  }
}

export const valeTransporteService = new ValeTransporteService();
export default valeTransporteService;
