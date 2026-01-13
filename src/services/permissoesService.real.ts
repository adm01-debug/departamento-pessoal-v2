// QA-FIX: PermissoesService Real
import { supabase } from "@/integrations/supabase/client";
export class PermissoesServiceReal {
  async listar() { const { data } = await supabase.from("permissoes").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("permissoes").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("permissoes").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("permissoes").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("permissoes").delete().eq("id", id); return true; }
}
export const permissoesServiceReal = new PermissoesServiceReal();
