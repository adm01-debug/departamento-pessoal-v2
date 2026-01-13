// QA-FIX: TurnosService Real
import { supabase } from "@/integrations/supabase/client";
export class TurnosServiceReal {
  async listar() { const { data } = await supabase.from("turnos").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("turnos").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("turnos").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("turnos").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("turnos").delete().eq("id", id); return true; }
}
export const turnosServiceReal = new TurnosServiceReal();
