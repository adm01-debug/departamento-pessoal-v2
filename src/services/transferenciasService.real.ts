// QA-FIX: TransferenciasService Real
import { supabase } from "@/integrations/supabase/client";
export class TransferenciasServiceReal {
  async listar() { const { data } = await supabase.from("transferencias").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("transferencias").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("transferencias").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("transferencias").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("transferencias").delete().eq("id", id); return true; }
}
export const transferenciasServiceReal = new TransferenciasServiceReal();
