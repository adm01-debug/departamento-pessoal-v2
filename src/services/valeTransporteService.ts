import { supabase } from "@/integrations/supabase/client";

export interface ValeTransporte {
  id: string;
  colaborador_id: string;
  optante: boolean;
  valor_diario: number;
  dias_uteis_mes: number;
  valor_mensal: number;
  desconto_6_porcento: number;
  valor_liquido: number;
  linhas: LinhaTransporte[];
  endereco_origem: string;
  endereco_destino: string;
  distancia_km?: number;
  created_at: string;
  updated_at: string;
}

export interface LinhaTransporte {
  id: string;
  vale_transporte_id: string;
  tipo: "onibus" | "metro" | "trem" | "barca" | "vlt";
  empresa: string;
  linha: string;
  sentido: "ida" | "volta" | "ida_volta";
  valor_passagem: number;
  quantidade_por_dia: number;
}

class ValeTransporteService {
  async obterPorColaborador(colaboradorId: string): Promise<ValeTransporte | null> {
    const { data, error } = await supabase.from("vales_transporte").select("*, linhas_transporte(*)").eq("colaborador_id", colaboradorId).single();
    if (error && error.code !== "PGRST116") throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criar(vt: Partial<ValeTransporte>): Promise<ValeTransporte> {
    const { linhas, ...dados } = vt;
    
    const valorDiario = linhas?.reduce((sum, l) => sum + (l.valor_passagem * l.quantidade_por_dia), 0) || 0;
    const diasUteis = dados.dias_uteis_mes || 22;
    const valorMensal = valorDiario * diasUteis;
    
    const { data: colab } = await supabase.from("colaboradores").select("salario").eq("id", dados.colaborador_id).single();
    const desconto = colab ? Math.min(valorMensal, colab.salario * 0.06) : 0;
    const valorLiquido = valorMensal - desconto;

    const { data, error } = await supabase.from("vales_transporte").insert([{
      ...dados,
      valor_diario: valorDiario,
      dias_uteis_mes: diasUteis,
      valor_mensal: valorMensal,
      desconto_6_porcento: desconto,
      valor_liquido: valorLiquido,
      optante: true
    }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);

    if (linhas) {
      for (const linha of linhas) {
        await supabase.from("linhas_transporte").insert([{ ...linha, vale_transporte_id: data.id }]);
      }
    }

    return data;
  }

  async atualizar(id: string, vt: Partial<ValeTransporte>): Promise<ValeTransporte> {
    const { data, error } = await supabase.from("vales_transporte").update({ ...vt, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async adicionarLinha(vtId: string, linha: Partial<LinhaTransporte>): Promise<LinhaTransporte> {
    const { data, error } = await supabase.from("linhas_transporte").insert([{ ...linha, vale_transporte_id: vtId }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    await this.recalcular(vtId);
    return data;
  }

  async removerLinha(linhaId: string): Promise<void> {
    const { data: linha } = await supabase.from("linhas_transporte").select("vale_transporte_id").eq("id", linhaId).single();
    const { error } = await supabase.from("linhas_transporte").delete().eq("id", linhaId);
    if (error) throw new Error(`Erro: ${error.message}`);
    if (linha) await this.recalcular(linha.vale_transporte_id);
  }

  async recalcular(vtId: string): Promise<ValeTransporte> {
    const { data: linhas } = await supabase.from("linhas_transporte").select("*").eq("vale_transporte_id", vtId);
    const { data: vt } = await supabase.from("vales_transporte").select("*, colaboradores(salario)").eq("id", vtId).single();
    
    if (!vt) throw new Error("Vale transporte não encontrado");

    const valorDiario = linhas?.reduce((sum, l) => sum + (l.valor_passagem * l.quantidade_por_dia), 0) || 0;
    const valorMensal = valorDiario * vt.dias_uteis_mes;
    const salario = (vt as any).colaboradores?.salario || 0;
    const desconto = Math.min(valorMensal, salario * 0.06);
    const valorLiquido = valorMensal - desconto;

    return this.atualizar(vtId, { valor_diario: valorDiario, valor_mensal: valorMensal, desconto_6_porcento: desconto, valor_liquido: valorLiquido });
  }

  async cancelarOpcao(colaboradorId: string): Promise<void> {
    await supabase.from("vales_transporte").update({ optante: false }).eq("colaborador_id", colaboradorId);
  }

  async calcularDescontoFolha(colaboradorId: string): Promise<number> {
    const vt = await this.obterPorColaborador(colaboradorId);
    if (!vt || !vt.optante) return 0;
    return vt.desconto_6_porcento;
  }
}

export const valeTransporteService = new ValeTransporteService();
export default valeTransporteService;
