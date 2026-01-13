// QA-FIX: AssinaturaDigitalService Real Implementation
import { supabase } from "@/integrations/supabase/client";

export class AssinaturaDigitalServiceReal {
  async listar() {
    const { data, error } = await supabase.from("assinaturaDigital").select("*");
    if (error) throw error;
    return data || [];
  }

  async buscarPorId(id: string) {
    const { data, error } = await supabase.from("assinaturaDigital").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async criar(dados: any) {
    const { data, error } = await supabase.from("assinaturaDigital").insert(dados).select().single();
    if (error) throw error;
    return data;
  }

  async atualizar(id: string, dados: any) {
    const { data, error } = await supabase.from("assinaturaDigital").update(dados).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async excluir(id: string) {
    const { error } = await supabase.from("assinaturaDigital").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}

export const assinaturaDigitalServiceReal = new AssinaturaDigitalServiceReal();
export default assinaturaDigitalServiceReal;
