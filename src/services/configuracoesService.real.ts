// QA-FIX: ConfiguracoesService Real Implementation
import { supabase } from "@/integrations/supabase/client";

export class ConfiguracoesServiceReal {
  async listar() {
    const { data, error } = await supabase.from("configuracoes").select("*");
    if (error) throw error;
    return data || [];
  }

  async buscarPorId(id: string) {
    const { data, error } = await supabase.from("configuracoes").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async criar(dados: any) {
    const { data, error } = await supabase.from("configuracoes").insert(dados).select().single();
    if (error) throw error;
    return data;
  }

  async atualizar(id: string, dados: any) {
    const { data, error } = await supabase.from("configuracoes").update(dados).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async excluir(id: string) {
    const { error } = await supabase.from("configuracoes").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}

export const configuracoesServiceReal = new ConfiguracoesServiceReal();
export default configuracoesServiceReal;
