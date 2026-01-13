// QA-FIX: PontosService Real
import { supabase } from "@/integrations/supabase/client";
export class PontosServiceReal {
  async listar() { const { data } = await supabase.from("pontos").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("pontos").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("pontos").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("pontos").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("pontos").delete().eq("id", id); return true; }
}
export const pontosServiceReal = new PontosServiceReal();
