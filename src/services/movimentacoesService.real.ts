// QA-FIX: MovimentacoesService Real
import { supabase } from "@/integrations/supabase/client";
export class MovimentacoesServiceReal {
  async listar() { const { data } = await supabase.from("movimentacoes").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("movimentacoes").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("movimentacoes").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("movimentacoes").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("movimentacoes").delete().eq("id", id); return true; }
}
export const movimentacoesServiceReal = new MovimentacoesServiceReal();
