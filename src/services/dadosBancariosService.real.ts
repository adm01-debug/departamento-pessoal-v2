// QA-FIX: DadosBancariosService Real Implementation
import { supabase } from "@/integrations/supabase/client";

export class DadosBancariosServiceReal {
  async listar() {
    const { data, error } = await supabase.from("dadosBancarios").select("*");
    if (error) throw error;
    return data || [];
  }

  async buscarPorId(id: string) {
    const { data, error } = await supabase.from("dadosBancarios").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async criar(dados: any) {
    const { data, error } = await supabase.from("dadosBancarios").insert(dados).select().single();
    if (error) throw error;
    return data;
  }

  async atualizar(id: string, dados: any) {
    const { data, error } = await supabase.from("dadosBancarios").update(dados).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async excluir(id: string) {
    const { error } = await supabase.from("dadosBancarios").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}

export const dadosBancariosServiceReal = new DadosBancariosServiceReal();
export default dadosBancariosServiceReal;
