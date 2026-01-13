// QA-FIX: PensoesService Real
import { supabase } from "@/integrations/supabase/client";
export class PensoesServiceReal {
  async listar() { const { data } = await supabase.from("pensoes").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("pensoes").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("pensoes").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("pensoes").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("pensoes").delete().eq("id", id); return true; }
}
export const pensoesServiceReal = new PensoesServiceReal();
