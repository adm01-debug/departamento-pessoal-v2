import { supabase } from "@/integrations/supabase/client";

export interface PlanoSaude {
  id: string;
  empresa_id: string;
  operadora: string;
  nome_plano: string;
  registro_ans: string;
  tipo: "enfermaria" | "apartamento" | "vip";
  abrangencia: "municipal" | "estadual" | "nacional";
  valor_titular: number;
  valor_dependente: number;
  coparticipacao: boolean;
  percentual_coparticipacao: number;
  carencia_dias: number;
  ativo: boolean;
  created_at: string;
}

export interface BeneficiarioPlano {
  id: string;
  plano_id: string;
  colaborador_id: string;
  tipo: "titular" | "dependente";
  dependente_id?: string;
  numero_carteirinha: string;
  data_adesao: string;
  data_carencia_fim?: string;
  valor_desconto: number;
  ativo: boolean;
}

class PlanoSaudeService {
  async listarPlanos(empresaId: string): Promise<PlanoSaude[]> {
    const { data, error } = await supabase.from("planos_saude").select("*").eq("empresa_id", empresaId).eq("ativo", true).order("nome_plano");
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async buscarPlano(id: string): Promise<PlanoSaude | null> {
    const { data, error } = await supabase.from("planos_saude").select("*").eq("id", id).single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criarPlano(plano: Partial<PlanoSaude>): Promise<PlanoSaude> {
    const { data, error } = await supabase.from("planos_saude").insert([{ ...plano, ativo: true }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async atualizarPlano(id: string, plano: Partial<PlanoSaude>): Promise<PlanoSaude> {
    const { data, error } = await supabase.from("planos_saude").update(plano).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async incluirBeneficiario(dados: Partial<BeneficiarioPlano>): Promise<BeneficiarioPlano> {
    const plano = await this.buscarPlano(dados.plano_id!);
    if (!plano) throw new Error("Plano não encontrado");

    const dataCarencia = new Date();
    dataCarencia.setDate(dataCarencia.getDate() + plano.carencia_dias);

    const valor = dados.tipo === "titular" ? plano.valor_titular : plano.valor_dependente;
    const carteirinha = this.gerarCarteirinha();

    const { data, error } = await supabase
      .from("beneficiarios_plano")
      .insert([{ ...dados, numero_carteirinha: carteirinha, data_carencia_fim: dataCarencia.toISOString().split("T")[0], valor_desconto: valor, ativo: true }])
      .select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async excluirBeneficiario(id: string): Promise<void> {
    const { error } = await supabase.from("beneficiarios_plano").update({ ativo: false }).eq("id", id);
    if (error) throw new Error(`Erro: ${error.message}`);
  }

  async listarBeneficiarios(colaboradorId: string): Promise<BeneficiarioPlano[]> {
    const { data, error } = await supabase.from("beneficiarios_plano").select("*, planos_saude(*)").eq("colaborador_id", colaboradorId).eq("ativo", true);
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async calcularDescontoFolha(colaboradorId: string): Promise<number> {
    const beneficiarios = await this.listarBeneficiarios(colaboradorId);
    return beneficiarios.reduce((sum, b) => sum + b.valor_desconto, 0);
  }

  private gerarCarteirinha(): string {
    return `PS${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  async obterRelatorioEmpresa(empresaId: string): Promise<{ total_beneficiarios: number; custo_mensal: number; planos: { nome: string; qtd: number }[] }> {
    const planos = await this.listarPlanos(empresaId);
    let totalBeneficiarios = 0;
    let custoMensal = 0;
    const planosInfo: { nome: string; qtd: number }[] = [];

    for (const plano of planos) {
      const { data } = await supabase.from("beneficiarios_plano").select("*").eq("plano_id", plano.id).eq("ativo", true);
      const qtd = data?.length || 0;
      totalBeneficiarios += qtd;
      custoMensal += (data || []).reduce((sum: number, b: any) => sum + b.valor_desconto, 0);
      planosInfo.push({ nome: plano.nome_plano, qtd });
    }

    return { total_beneficiarios: totalBeneficiarios, custo_mensal: custoMensal, planos: planosInfo };
  }
}

export const planoSaudeService = new PlanoSaudeService();
export default planoSaudeService;
