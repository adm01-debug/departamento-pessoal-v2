import { supabase } from "@/integrations/supabase/client";
export interface AfastamentoData { id?: string; colaboradorId: string; tipo: string; dataInicio: Date; dataFim?: Date; dias: number; cid?: string; crm?: string; inss: boolean; documentoId?: string; observacao?: string; }
class AfastamentoService {
  private table = "afastamentos";
  async getAll(): Promise<AfastamentoData[]> { const { data, error } = await supabase.from(this.table).select("*").order("data_inicio", { ascending: false }); if (error) throw error; return data || []; }
  async getById(id: string): Promise<AfastamentoData | null> { const { data, error } = await supabase.from(this.table).select("*").eq("id", id).single(); if (error) throw error; return data; }
  async getByColaborador(colaboradorId: string): Promise<AfastamentoData[]> { const { data, error } = await supabase.from(this.table).select("*").eq("colaborador_id", colaboradorId); if (error) throw error; return data || []; }
  async create(data: Omit<AfastamentoData, "id">): Promise<AfastamentoData> { const { data: result, error } = await supabase.from(this.table).insert(data).select().single(); if (error) throw error; return result; }
  async update(id: string, data: Partial<AfastamentoData>): Promise<AfastamentoData> { const { data: result, error } = await supabase.from(this.table).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async delete(id: string): Promise<void> { const { error } = await supabase.from(this.table).delete().eq("id", id); if (error) throw error; }
}
export const afastamentoService = new AfastamentoService();
export default afastamentoService;
