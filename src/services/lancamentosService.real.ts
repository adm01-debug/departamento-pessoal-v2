// QA-FIX: LancamentosService Real
import { supabase } from "@/integrations/supabase/client";
export class LancamentosServiceReal {
  async listar() { const { data } = await supabase.from("lancamentos").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("lancamentos").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("lancamentos").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("lancamentos").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("lancamentos").delete().eq("id", id); return true; }
}
export const lancamentosServiceReal = new LancamentosServiceReal();
