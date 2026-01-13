// QA-FIX: ParametrosService Real
import { supabase } from "@/integrations/supabase/client";
export class ParametrosServiceReal {
  async listar() { const { data } = await supabase.from("parametros").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("parametros").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("parametros").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("parametros").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("parametros").delete().eq("id", id); return true; }
}
export const parametrosServiceReal = new ParametrosServiceReal();
