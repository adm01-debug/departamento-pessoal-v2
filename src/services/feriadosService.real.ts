// QA-FIX: FeriadosService Real
import { supabase } from "@/integrations/supabase/client";
export class FeriadosServiceReal {
  async listar() { const { data } = await supabase.from("feriados").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("feriados").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("feriados").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("feriados").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("feriados").delete().eq("id", id); return true; }
}
export const feriadosServiceReal = new FeriadosServiceReal();
