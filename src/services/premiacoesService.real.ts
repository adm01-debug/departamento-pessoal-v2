// QA-FIX: PremiacoesService Real
import { supabase } from "@/integrations/supabase/client";
export class PremiacoesServiceReal {
  async listar() { const { data } = await supabase.from("premiacoes").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("premiacoes").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("premiacoes").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("premiacoes").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("premiacoes").delete().eq("id", id); return true; }
}
export const premiacoesServiceReal = new PremiacoesServiceReal();
