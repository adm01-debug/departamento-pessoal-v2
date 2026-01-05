import { supabase } from "@/integrations/supabase/client";
class TreinamentoService {
  async getAll() { const { data } = await supabase.from("treinamentos").select("*").order("nome"); return data || []; }
  async getById(id: string) { const { data } = await supabase.from("treinamentos").select("*").eq("id", id).single(); return data; }
  async create(d: any) { const { data } = await supabase.from("treinamentos").insert(d).select().single(); return data; }
  async update(id: string, d: any) { const { data } = await supabase.from("treinamentos").update(d).eq("id", id).select().single(); return data; }
  async delete(id: string) { await supabase.from("treinamentos").delete().eq("id", id); }
}
export const treinamentoService = new TreinamentoService();
export default treinamentoService;
