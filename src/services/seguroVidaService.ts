import { supabase } from "@/integrations/supabase/client";

export interface SeguroVida {
  id: string;
  empresa_id: string;
  seguradora: string;
  numero_apolice: string;
  tipo: "vida" | "vida_e_acidentes" | "acidentes_pessoais";
  capital_segurado_morte: number;
  capital_segurado_invalidez: number;
  capital_segurado_funeral: number;
  valor_premio_mensal: number;
  percentual_empresa: number;
  percentual_colaborador: number;
  cobertura_conjuge: boolean;
  cobertura_filhos: boolean;
  vigencia_inicio: string;
  vigencia_fim: string;
  contato: string;
  telefone: string;
  ativo: boolean;
  created_at: string;
}

export interface BeneficiarioSeguro {
  id: string;
  seguro_vida_id: string;
  colaborador_id: string;
  nome: string;
  cpf: string;
  parentesco: string;
  percentual_participacao: number;
  data_inclusao: string;
  status: "ativo" | "inativo";
}

class SeguroVidaService {
  async listarSeguros(empresaId: string): Promise<SeguroVida[]> {
    const { data, error } = await supabase.from("seguros_vida").select("*").eq("empresa_id", empresaId).order("seguradora");
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

  async vincularColaborador(seguroId: string, colaboradorId: string): Promise<void> {
    const { error } = await supabase.from("seguros_colaboradores").insert([{ seguro_vida_id: seguroId, colaborador_id: colaboradorId, data_adesao: new Date().toISOString().split("T")[0], status: "ativo" }]);
    if (error) throw new Error(`Erro: ${error.message}`);
  }

  async adicionarBeneficiario(seguroId: string, colaboradorId: string, dados: Partial<BeneficiarioSeguro>): Promise<BeneficiarioSeguro> {
    const beneficiarios = await this.listarBeneficiarios(seguroId, colaboradorId);
    const totalPercentual = beneficiarios.reduce((sum, b) => sum + b.percentual_participacao, 0);
    
    if (totalPercentual + (dados.percentual_participacao || 0) > 100) {
      throw new Error("Total de participação não pode exceder 100%");
    }

    const { data, error } = await supabase.from("beneficiarios_seguro").insert([{
      seguro_vida_id: seguroId,
      colaborador_id: colaboradorId,
      data_inclusao: new Date().toISOString().split("T")[0],
      status: "ativo",
      ...dados
    }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async listarBeneficiarios(seguroId: string, colaboradorId: string): Promise<BeneficiarioSeguro[]> {
    const { data, error } = await supabase.from("beneficiarios_seguro").select("*").eq("seguro_vida_id", seguroId).eq("colaborador_id", colaboradorId).eq("status", "ativo");
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async calcularDesconto(colaboradorId: string): Promise<{ valor_empresa: number; valor_colaborador: number }> {
    const { data: vinculos } = await supabase.from("seguros_colaboradores").select("*, seguros_vida(*)").eq("colaborador_id", colaboradorId).eq("status", "ativo");
    
    let totalEmpresa = 0;
    let totalColaborador = 0;

    if (vinculos) {
      for (const v of vinculos) {
        const seguro = (v as any).seguros_vida as SeguroVida;
        totalEmpresa += seguro.valor_premio_mensal * (seguro.percentual_empresa / 100);
        totalColaborador += seguro.valor_premio_mensal * (seguro.percentual_colaborador / 100);
      }
    }

    return { valor_empresa: totalEmpresa, valor_colaborador: totalColaborador };
  }

  async registrarSinistro(seguroId: string, colaboradorId: string, tipo: string, descricao: string): Promise<void> {
    const { error } = await supabase.from("sinistros_seguro").insert([{
      seguro_vida_id: seguroId,
      colaborador_id: colaboradorId,
      tipo,
      descricao,
      data_ocorrencia: new Date().toISOString().split("T")[0],
      status: "em_analise"
    }]);
    if (error) throw new Error(`Erro: ${error.message}`);
  }
}

export const seguroVidaService = new SeguroVidaService();
export default seguroVidaService;
