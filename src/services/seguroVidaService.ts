import { supabase } from "@/integrations/supabase/client";

export interface SeguroVida {
  id: string;
  empresa_id: string;
  seguradora: string;
  nome_plano: string;
  numero_apolice: string;
  capital_segurado: number;
  capital_invalidez: number;
  valor_mensal: number;
  coberturas: string[];
  vigencia_inicio: string;
  vigencia_fim: string;
  ativo: boolean;
  created_at: string;
}

export interface BeneficiarioSeguro {
  id: string;
  seguro_id: string;
  colaborador_id: string;
  beneficiarios_indicados: { nome: string; parentesco: string; percentual: number }[];
  data_adesao: string;
  valor_desconto: number;
  ativo: boolean;
}

class SeguroVidaService {
  async listarSeguros(empresaId: string): Promise<SeguroVida[]> {
    const { data, error } = await supabase.from("seguros_vida").select("*").eq("empresa_id", empresaId).eq("ativo", true);
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async buscarSeguro(id: string): Promise<SeguroVida | null> {
    const { data, error } = await supabase.from("seguros_vida").select("*").eq("id", id).single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criarSeguro(seguro: Partial<SeguroVida>): Promise<SeguroVida> {
    const { data, error } = await supabase.from("seguros_vida").insert([{ ...seguro, ativo: true }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async incluirColaborador(dados: Partial<BeneficiarioSeguro>): Promise<BeneficiarioSeguro> {
    const seguro = await this.buscarSeguro(dados.seguro_id!);
    if (!seguro) throw new Error("Seguro não encontrado");

    const { data, error } = await supabase
      .from("beneficiarios_seguro")
      .insert([{ ...dados, valor_desconto: seguro.valor_mensal, ativo: true }])
      .select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async atualizarBeneficiarios(id: string, beneficiarios: { nome: string; parentesco: string; percentual: number }[]): Promise<BeneficiarioSeguro> {
    const total = beneficiarios.reduce((sum, b) => sum + b.percentual, 0);
    if (total !== 100) throw new Error("Percentuais devem somar 100%");

    const { data, error } = await supabase
      .from("beneficiarios_seguro")
      .update({ beneficiarios_indicados: beneficiarios })
      .eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async excluirColaborador(id: string): Promise<void> {
    const { error } = await supabase.from("beneficiarios_seguro").update({ ativo: false }).eq("id", id);
    if (error) throw new Error(`Erro: ${error.message}`);
  }

  async listarBeneficiarios(colaboradorId: string): Promise<BeneficiarioSeguro[]> {
    const { data, error } = await supabase.from("beneficiarios_seguro").select("*, seguros_vida(*)").eq("colaborador_id", colaboradorId).eq("ativo", true);
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async calcularDescontoFolha(colaboradorId: string): Promise<number> {
    const beneficiarios = await this.listarBeneficiarios(colaboradorId);
    return beneficiarios.reduce((sum, b) => sum + b.valor_desconto, 0);
  }
}

export const seguroVidaService = new SeguroVidaService();
export default seguroVidaService;
