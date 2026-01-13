// QA-FIX: SindicatosService Real
import { supabase } from "@/integrations/supabase/client";
export class SindicatosServiceReal {
  async listar() { const { data } = await supabase.from("sindicatos").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("sindicatos").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("sindicatos").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("sindicatos").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("sindicatos").delete().eq("id", id); return true; }
}
export const sindicatosServiceReal = new SindicatosServiceReal();
