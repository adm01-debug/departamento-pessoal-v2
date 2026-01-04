import { supabase } from "@/integrations/supabase/client";

export interface PlanoSaude {
  id: string;
  empresa_id: string;
  operadora: string;
  registro_ans: string;
  tipo: "individual" | "coletivo_empresarial" | "coletivo_adesao";
  abrangencia: "municipal" | "estadual" | "nacional";
  acomodacao: "enfermaria" | "apartamento";
  coparticipacao: boolean;
  valor_mensalidade_titular: number;
  valor_mensalidade_dependente: number;
  percentual_empresa: number;
  percentual_colaborador: number;
  carencia_dias: number;
  contato: string;
  telefone: string;
  ativo: boolean;
  created_at: string;
}

export interface BeneficiarioPlano {
  id: string;
  plano_saude_id: string;
  colaborador_id: string;
  tipo: "titular" | "dependente";
  nome: string;
  cpf: string;
  data_nascimento: string;
  parentesco?: string;
  numero_carteirinha?: string;
  data_inclusao: string;
  data_exclusao?: string;
  status: "ativo" | "inativo" | "carencia";
}

class PlanoSaudeService {
  async listarPlanos(empresaId: string): Promise<PlanoSaude[]> {
    const { data, error } = await supabase.from("planos_saude").select("*").eq("empresa_id", empresaId).order("operadora");
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

  async incluirTitular(planoId: string, colaboradorId: string, dados: Partial<BeneficiarioPlano>): Promise<BeneficiarioPlano> {
    const plano = await this.buscarPlano(planoId);
    if (!plano) throw new Error("Plano não encontrado");

    const dataCarencia = new Date();
    dataCarencia.setDate(dataCarencia.getDate() + plano.carencia_dias);

    const { data, error } = await supabase.from("beneficiarios_plano").insert([{
      plano_saude_id: planoId,
      colaborador_id: colaboradorId,
      tipo: "titular",
      data_inclusao: new Date().toISOString().split("T")[0],
      status: plano.carencia_dias > 0 ? "carencia" : "ativo",
      ...dados
    }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async incluirDependente(titularId: string, dados: Partial<BeneficiarioPlano>): Promise<BeneficiarioPlano> {
    const { data: titular } = await supabase.from("beneficiarios_plano").select("plano_saude_id, colaborador_id").eq("id", titularId).single();
    if (!titular) throw new Error("Titular não encontrado");

    const { data, error } = await supabase.from("beneficiarios_plano").insert([{
      plano_saude_id: titular.plano_saude_id,
      colaborador_id: titular.colaborador_id,
      tipo: "dependente",
      data_inclusao: new Date().toISOString().split("T")[0],
      status: "ativo",
      ...dados
    }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async excluirBeneficiario(id: string): Promise<void> {
    const { error } = await supabase.from("beneficiarios_plano").update({ status: "inativo", data_exclusao: new Date().toISOString().split("T")[0] }).eq("id", id);
    if (error) throw new Error(`Erro: ${error.message}`);
  }

  async listarBeneficiarios(colaboradorId: string): Promise<BeneficiarioPlano[]> {
    const { data, error } = await supabase.from("beneficiarios_plano").select("*, planos_saude(*)").eq("colaborador_id", colaboradorId).eq("status", "ativo");
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async calcularDesconto(colaboradorId: string): Promise<{ valor_empresa: number; valor_colaborador: number }> {
    const beneficiarios = await this.listarBeneficiarios(colaboradorId);
    let totalEmpresa = 0;
    let totalColaborador = 0;

    for (const ben of beneficiarios) {
      const plano = (ben as any).planos_saude as PlanoSaude;
      const valor = ben.tipo === "titular" ? plano.valor_mensalidade_titular : plano.valor_mensalidade_dependente;
      totalEmpresa += valor * (plano.percentual_empresa / 100);
      totalColaborador += valor * (plano.percentual_colaborador / 100);
    }

    return { valor_empresa: totalEmpresa, valor_colaborador: totalColaborador };
  }
}

export const planoSaudeService = new PlanoSaudeService();
export default planoSaudeService;
