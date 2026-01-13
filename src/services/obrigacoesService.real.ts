// QA-FIX: ObrigacoesService Real
import { supabase } from "@/integrations/supabase/client";
export class ObrigacoesServiceReal {
  async listar() { const { data } = await supabase.from("obrigacoes").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("obrigacoes").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("obrigacoes").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("obrigacoes").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("obrigacoes").delete().eq("id", id); return true; }
}
export const obrigacoesServiceReal = new ObrigacoesServiceReal();
