// QA-FIX: UsuariosService Real
import { supabase } from "@/integrations/supabase/client";
export class UsuariosServiceReal {
  async listar() { const { data } = await supabase.from("usuarios").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("usuarios").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("usuarios").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("usuarios").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("usuarios").delete().eq("id", id); return true; }
}
export const usuariosServiceReal = new UsuariosServiceReal();
