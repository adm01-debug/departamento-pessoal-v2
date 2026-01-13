// QA-FIX: BancosService Real Implementation
import { supabase } from "@/integrations/supabase/client";

export class BancosServiceReal {
  async listar() {
    const { data, error } = await supabase.from("bancos").select("*");
    if (error) throw error;
    return data || [];
  }

  async buscarPorId(id: string) {
    const { data, error } = await supabase.from("bancos").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async criar(dados: any) {
    const { data, error } = await supabase.from("bancos").insert(dados).select().single();
    if (error) throw error;
    return data;
  }

  async atualizar(id: string, dados: any) {
    const { data, error } = await supabase.from("bancos").update(dados).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async excluir(id: string) {
    const { error } = await supabase.from("bancos").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}

export const bancosServiceReal = new BancosServiceReal();
export default bancosServiceReal;
