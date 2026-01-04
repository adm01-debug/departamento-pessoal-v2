import { supabase } from "@/integrations/supabase/client";

export interface Sindicato {
  id: string;
  nome: string;
  cnpj: string;
  codigo_entidade: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  email: string;
  site?: string;
  data_base: string;
  percentual_contribuicao: number;
  ativo: boolean;
  created_at: string;
}

export interface ConvencaoColetiva {
  id: string;
  sindicato_id: string;
  ano_referencia: number;
  data_inicio: string;
  data_fim: string;
  piso_salarial: number;
  percentual_reajuste: number;
  clausulas: string;
  arquivo_url?: string;
  created_at: string;
}

class SindicatoService {
  async listar(): Promise<Sindicato[]> {
    const { data, error } = await supabase.from("sindicatos").select("*").eq("ativo", true).order("nome");
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
    const { data, error } = await supabase.from("convencoes_coletivas").select("*").eq("sindicato_id", sindicatoId).order("ano_referencia", { ascending: false });
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async criarConvencao(convencao: Partial<ConvencaoColetiva>): Promise<ConvencaoColetiva> {
    const { data, error } = await supabase.from("convencoes_coletivas").insert([convencao]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
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

  async calcularContribuicaoSindical(colaboradorId: string, salario: number, sindicatoId: string): Promise<number> {
    const sindicato = await this.buscarPorId(sindicatoId);
    if (!sindicato) return 0;
    return salario * (sindicato.percentual_contribuicao / 100);
  }

  async vincularColaborador(colaboradorId: string, sindicatoId: string): Promise<void> {
    await supabase.from("colaboradores").update({ sindicato_id: sindicatoId }).eq("id", colaboradorId);
  }
}

export const sindicatoService = new SindicatoService();
export default sindicatoService;
