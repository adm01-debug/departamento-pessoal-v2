// QA-FIX: PromocoesService Real
import { supabase } from "@/integrations/supabase/client";
export class PromocoesServiceReal {
  async listar() { const { data } = await supabase.from("promocoes").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("promocoes").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("promocoes").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("promocoes").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("promocoes").delete().eq("id", id); return true; }
}
export const promocoesServiceReal = new PromocoesServiceReal();
