// QA-FIX: ExportacaoService Real Implementation
import { supabase } from "@/integrations/supabase/client";

export class ExportacaoServiceReal {
  async listar() {
    const { data, error } = await supabase.from("exportacao").select("*");
    if (error) throw error;
    return data || [];
  }

  async buscarPorId(id: string) {
    const { data, error } = await supabase.from("exportacao").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async criar(dados: any) {
    const { data, error } = await supabase.from("exportacao").insert(dados).select().single();
    if (error) throw error;
    return data;
  }

  async atualizar(id: string, dados: any) {
    const { data, error } = await supabase.from("exportacao").update(dados).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async excluir(id: string) {
    const { error } = await supabase.from("exportacao").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}

export const exportacaoServiceReal = new ExportacaoServiceReal();
export default exportacaoServiceReal;
