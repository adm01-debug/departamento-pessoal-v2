// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";
export interface ExameData { id?: string; colaboradorId: string; tipo: string; dataExame: Date; dataValidade: Date; resultado?: string; medico: string; crm: string; riscos?: string[]; observacoes?: string; }
class ExameService {
  async getAll() { const { data } = await supabase.from("exames").select("*").order("data_exame", { ascending: false }); return data || []; }
  async getByColaborador(id: string) { const { data } = await supabase.from("exames").select("*").eq("colaborador_id", id); return data || []; }
  async getVencidos() { const { data } = await supabase.from("exames").select("*").lt("data_validade", new Date().toISOString()); return data || []; }
  async create(d: any) { const { data } = await supabase.from("exames").insert(d).select().single(); return data; }
  async update(id: string, d: any) { const { data } = await supabase.from("exames").update(d).eq("id", id).select().single(); return data; }
  async delete(id: string) { await supabase.from("exames").delete().eq("id", id); }
}
export const exameService = new ExameService();
export default exameService;
