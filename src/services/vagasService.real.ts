// QA-FIX: VagasService Real
import { supabase } from "@/integrations/supabase/client";
export class VagasServiceReal {
  async listar() { const { data } = await supabase.from("vagas").select("*"); return data || []; }
  async buscar(id: string) { const { data } = await supabase.from("vagas").select("*").eq("id", id).single(); return data; }
  async criar(d: any) { const { data } = await supabase.from("vagas").insert(d).select().single(); return data; }
  async atualizar(id: string, d: any) { const { data } = await supabase.from("vagas").update(d).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("vagas").delete().eq("id", id); return true; }
}
export const vagasServiceReal = new VagasServiceReal();
