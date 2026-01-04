import { supabase } from "@/integrations/supabase/client";

export interface Sindicato {
  id: string;
  nome: string;
  cnpj: string;
  codigo_sindical: string;
  categoria: string;
  abrangencia: "municipal" | "estadual" | "nacional";
  uf?: string;
  cidade?: string;
  endereco: string;
  telefone: string;
  email: string;
  site?: string;
  data_base: string;
  contribuicao_sindical: number;
  contribuicao_assistencial: number;
  contribuicao_confederativa: number;
  ativo: boolean;
  created_at: string;
}

export interface ConvencaoColetiva {
  id: string;
  sindicato_id: string;
  ano_vigencia: number;
  data_inicio: string;
  data_fim: string;
  piso_salarial: number;
  reajuste_percentual: number;
  adicional_hora_extra: number;
  adicional_noturno: number;
  vale_refeicao: number;
  vale_alimentacao: number;
  plano_saude_obrigatorio: boolean;
  arquivo_url?: string;
}

class SindicatoService {
  async listar(): Promise<Sindicato[]> {
    const { data, error } = await supabase.from("sindicatos").select("*").order("nome");
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async buscarPorId(id: string): Promise<Sindicato | null> {
    const { data, error } = await supabase.from("sindicatos").select("*").eq("id", id).single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criar(sindicato: Partial<Sindicato>): Promise<Sindicato> {
    const { data, error } = await supabase.from("sindicatos").insert([{ ...sindicato, ativo: true }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async atualizar(id: string, sindicato: Partial<Sindicato>): Promise<Sindicato> {
    const { data, error } = await supabase.from("sindicatos").update(sindicato).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async listarConvencoes(sindicatoId: string): Promise<ConvencaoColetiva[]> {
    const { data, error } = await supabase.from("convencoes_coletivas").select("*").eq("sindicato_id", sindicatoId).order("ano_vigencia", { ascending: false });
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async obterConvencaoVigente(sindicatoId: string): Promise<ConvencaoColetiva | null> {
    const hoje = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("convencoes_coletivas")
      .select("*")
      .eq("sindicato_id", sindicatoId)
      .lte("data_inicio", hoje)
      .gte("data_fim", hoje)
      .single();
    if (error) return null;
    return data;
  }

  async criarConvencao(convencao: Partial<ConvencaoColetiva>): Promise<ConvencaoColetiva> {
    const { data, error } = await supabase.from("convencoes_coletivas").insert([convencao]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async calcularContribuicoes(colaboradorId: string, sindicatoId: string): Promise<{ sindical: number; assistencial: number; confederativa: number }> {
    const sindicato = await this.buscarPorId(sindicatoId);
    const { data: colab } = await supabase.from("colaboradores").select("salario").eq("id", colaboradorId).single();
    if (!sindicato || !colab) throw new Error("Dados não encontrados");

    return {
      sindical: colab.salario * (sindicato.contribuicao_sindical / 100),
      assistencial: colab.salario * (sindicato.contribuicao_assistencial / 100),
      confederativa: colab.salario * (sindicato.contribuicao_confederativa / 100)
    };
  }
}

export const sindicatoService = new SindicatoService();
export default sindicatoService;
