// QA-FIX: SuspensoesContratuaisService Real
import { supabase } from "@/integrations/supabase/client";
export class SuspensoesContratuaisServiceReal {
  async listar() { const { data } = await supabase.from("suspensoesContratuais").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("suspensoesContratuais").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("suspensoesContratuais").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("suspensoesContratuais").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("suspensoesContratuais").delete().eq("id", id); return true; }
}
export const suspensoesContratuaisServiceReal = new SuspensoesContratuaisServiceReal();
