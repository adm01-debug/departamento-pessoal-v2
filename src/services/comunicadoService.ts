// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";
class ComunicadoService {
  async getAll() { const { data } = await supabase.from("comunicados").select("*").order("data_publicacao", { ascending: false }); return data || []; }
  async getAtivos() { const { data } = await supabase.from("comunicados").select("*").eq("ativo", true).gte("data_expiracao", new Date().toISOString()).order("prioridade"); return data || []; }
  async create(d: any) { const { data } = await supabase.from("comunicados").insert(d).select().single(); return data; }
  async update(id: string, d: any) { const { data } = await supabase.from("comunicados").update(d).eq("id", id).select().single(); return data; }
  async delete(id: string) { await supabase.from("comunicados").delete().eq("id", id); }
}
export const comunicadoService = new ComunicadoService();
export default comunicadoService;
