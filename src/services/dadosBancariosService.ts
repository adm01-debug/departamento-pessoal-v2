// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";
export interface DadosBancariosData { id?: string; colaboradorId: string; banco: string; codigoBanco: string; agencia: string; digitoAgencia?: string; conta: string; digitoConta?: string; tipoConta: string; chavePix?: string; tipoChavePix?: string; principal: boolean; ativo: boolean; }
class DadosBancariosService {
  async getByColaborador(colaboradorId: string): Promise<DadosBancariosData[]> { const { data } = await supabase.from("dados_bancarios").select("*").eq("colaborador_id", colaboradorId); return data || []; }
  async getPrincipal(colaboradorId: string): Promise<DadosBancariosData | null> { const { data } = await supabase.from("dados_bancarios").select("*").eq("colaborador_id", colaboradorId).eq("principal", true).single(); return data; }
  async create(data: Omit<DadosBancariosData, "id">): Promise<DadosBancariosData> { const { data: result, error } = await supabase.from("dados_bancarios").insert(data).select().single(); if (error) throw error; return result; }
  async update(id: string, data: Partial<DadosBancariosData>): Promise<DadosBancariosData> { const { data: result, error } = await supabase.from("dados_bancarios").update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async delete(id: string): Promise<void> { await supabase.from("dados_bancarios").delete().eq("id", id); }
}
export const dadosBancariosService = new DadosBancariosService();
export default dadosBancariosService;
