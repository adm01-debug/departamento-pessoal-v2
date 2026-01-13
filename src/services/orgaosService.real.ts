// QA-FIX: OrgaosService Real
import { supabase } from "@/integrations/supabase/client";
export class OrgaosServiceReal {
  async listar() { const { data } = await supabase.from("orgaos").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("orgaos").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("orgaos").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("orgaos").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("orgaos").delete().eq("id", id); return true; }
}
export const orgaosServiceReal = new OrgaosServiceReal();
