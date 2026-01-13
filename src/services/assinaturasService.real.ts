// QA-FIX: AssinaturasService Real Implementation
import { supabase } from "@/integrations/supabase/client";

export class AssinaturasServiceReal {
  async listar() {
    const { data, error } = await supabase.from("assinaturas").select("*");
    if (error) throw error;
    return data || [];
  }

  async buscarPorId(id: string) {
    const { data, error } = await supabase.from("assinaturas").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async criar(dados: any) {
    const { data, error } = await supabase.from("assinaturas").insert(dados).select().single();
    if (error) throw error;
    return data;
  }

  async atualizar(id: string, dados: any) {
    const { data, error } = await supabase.from("assinaturas").update(dados).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async excluir(id: string) {
    const { error } = await supabase.from("assinaturas").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}

export const assinaturasServiceReal = new AssinaturasServiceReal();
export default assinaturasServiceReal;
