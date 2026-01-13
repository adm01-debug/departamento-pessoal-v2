// QA-FIX: JornadasService Real
import { supabase } from "@/integrations/supabase/client";
export class JornadasServiceReal {
  async listar() { const { data } = await supabase.from("jornadas").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("jornadas").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("jornadas").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("jornadas").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("jornadas").delete().eq("id", id); return true; }
}
export const jornadasServiceReal = new JornadasServiceReal();
