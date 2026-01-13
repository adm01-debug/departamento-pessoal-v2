// QA-FIX: IntegracaoService Real
import { supabase } from "@/integrations/supabase/client";
export class IntegracaoServiceReal {
  async listar() { const { data } = await supabase.from("integracao").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("integracao").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("integracao").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("integracao").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("integracao").delete().eq("id", id); return true; }
}
export const integracaoServiceReal = new IntegracaoServiceReal();
