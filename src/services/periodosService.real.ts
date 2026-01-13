// QA-FIX: PeriodosService Real
import { supabase } from "@/integrations/supabase/client";
export class PeriodosServiceReal {
  async listar() { const { data } = await supabase.from("periodos").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("periodos").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("periodos").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("periodos").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("periodos").delete().eq("id", id); return true; }
}
export const periodosServiceReal = new PeriodosServiceReal();
