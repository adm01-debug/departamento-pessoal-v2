import { supabase } from "@/integrations/supabase/client";

export interface Convenio {
  id: string;
  empresa_id: string;
  nome: string;
  tipo: "farmacia" | "supermercado" | "combustivel" | "educacao" | "lazer" | "outros";
  cnpj: string;
  contato: string;
  telefone: string;
  email: string;
  limite_mensal: number;
  desconto_folha: boolean;
  percentual_desconto: number;
  ativo: boolean;
  created_at: string;
}

export interface ConvenioColaborador {
  id: string;
  convenio_id: string;
  colaborador_id: string;
  limite_individual: number;
  saldo_utilizado: number;
  ativo: boolean;
}

class ConvenioService {
  async listar(empresaId: string): Promise<Convenio[]> {
    const { data, error } = await supabase.from("convenios").select("*").eq("empresa_id", empresaId).order("nome");
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async buscarPorId(id: string): Promise<Convenio | null> {
    const { data, error } = await supabase.from("convenios").select("*").eq("id", id).single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criar(convenio: Partial<Convenio>): Promise<Convenio> {
    const { data, error } = await supabase.from("convenios").insert([{ ...convenio, ativo: true }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async atualizar(id: string, convenio: Partial<Convenio>): Promise<Convenio> {
    const { data, error } = await supabase.from("convenios").update(convenio).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async vincularColaborador(convenioId: string, colaboradorId: string, limiteIndividual: number): Promise<ConvenioColaborador> {
    const { data, error } = await supabase
      .from("convenios_colaboradores")
      .insert([{ convenio_id: convenioId, colaborador_id: colaboradorId, limite_individual: limiteIndividual, saldo_utilizado: 0, ativo: true }])
      .select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async registrarUtilizacao(convenioColaboradorId: string, valor: number): Promise<ConvenioColaborador> {
    const { data: atual } = await supabase.from("convenios_colaboradores").select("*").eq("id", convenioColaboradorId).single();
    if (!atual) throw new Error("Vínculo não encontrado");
    if (atual.saldo_utilizado + valor > atual.limite_individual) throw new Error("Limite excedido");

    const { data, error } = await supabase
      .from("convenios_colaboradores")
      .update({ saldo_utilizado: atual.saldo_utilizado + valor })
      .eq("id", convenioColaboradorId).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async resetarSaldosMensais(empresaId: string): Promise<void> {
    const convenios = await this.listar(empresaId);
    for (const conv of convenios) {
      await supabase.from("convenios_colaboradores").update({ saldo_utilizado: 0 }).eq("convenio_id", conv.id);
    }
  }

  async obterConveniosColaborador(colaboradorId: string): Promise<ConvenioColaborador[]> {
    const { data, error } = await supabase.from("convenios_colaboradores").select("*, convenios(*)").eq("colaborador_id", colaboradorId).eq("ativo", true);
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }
}

export const convenioService = new ConvenioService();
export default convenioService;
