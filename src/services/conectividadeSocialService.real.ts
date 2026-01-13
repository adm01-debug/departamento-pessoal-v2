// QA-FIX: ConectividadeSocialService Real Implementation
import { supabase } from "@/integrations/supabase/client";

export class ConectividadeSocialServiceReal {
  async listar() {
    const { data, error } = await supabase.from("conectividadeSocial").select("*");
    if (error) throw error;
    return data || [];
  }

  async buscarPorId(id: string) {
    const { data, error } = await supabase.from("conectividadeSocial").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async criar(dados: any) {
    const { data, error } = await supabase.from("conectividadeSocial").insert(dados).select().single();
    if (error) throw error;
    return data;
  }

  async atualizar(id: string, dados: any) {
    const { data, error } = await supabase.from("conectividadeSocial").update(dados).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async excluir(id: string) {
    const { error } = await supabase.from("conectividadeSocial").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}

export const conectividadeSocialServiceReal = new ConectividadeSocialServiceReal();
export default conectividadeSocialServiceReal;
