// QA-FIX: RecibosService Real
import { supabase } from "@/integrations/supabase/client";
export class RecibosServiceReal {
  async listar() { const { data } = await supabase.from("recibos").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("recibos").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("recibos").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("recibos").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("recibos").delete().eq("id", id); return true; }
}
export const recibosServiceReal = new RecibosServiceReal();
