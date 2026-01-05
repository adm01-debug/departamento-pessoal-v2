import { supabase } from "@/integrations/supabase/client";
class AvaliacaoService {
  async getAll() { const { data } = await supabase.from("avaliacoes").select("*").order("data_inicio", { ascending: false }); return data || []; }
  async getByColaborador(id: string) { const { data } = await supabase.from("avaliacoes").select("*").eq("colaborador_id", id); return data || []; }
  async getPendentes() { const { data } = await supabase.from("avaliacoes").select("*").neq("status", "CONCLUIDA"); return data || []; }
  async create(d: any) { const { data } = await supabase.from("avaliacoes").insert(d).select().single(); return data; }
  async update(id: string, d: any) { const { data } = await supabase.from("avaliacoes").update(d).eq("id", id).select().single(); return data; }
  async concluir(id: string, notaFinal: number) { return this.update(id, { status: "CONCLUIDA", nota_final: notaFinal, data_fim: new Date() }); }
}
export const avaliacaoService = new AvaliacaoService();
export default avaliacaoService;
