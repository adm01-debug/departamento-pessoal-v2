// QA-FIX: ImpressaoService Real
import { supabase } from "@/integrations/supabase/client";
export class ImpressaoServiceReal {
  async listar() { const { data } = await supabase.from("impressao").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("impressao").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("impressao").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("impressao").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("impressao").delete().eq("id", id); return true; }
}
export const impressaoServiceReal = new ImpressaoServiceReal();
