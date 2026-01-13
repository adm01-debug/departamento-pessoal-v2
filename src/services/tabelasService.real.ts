// QA-FIX: TabelasService Real
import { supabase } from "@/integrations/supabase/client";
export class TabelasServiceReal {
  async listar() { const { data } = await supabase.from("tabelas").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("tabelas").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("tabelas").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("tabelas").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("tabelas").delete().eq("id", id); return true; }
}
export const tabelasServiceReal = new TabelasServiceReal();
