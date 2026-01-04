import { supabase } from "@/integrations/supabase/client";
export interface ContratoData { id?: string; colaboradorId?: string; tipo?: string; dataInicio?: Date; dataFim?: Date; salario?: number; status?: string; }
class ContratoService {
  private tableName = "contratos";
  async getAll(filters?: Record<string, any>): Promise<ContratoData[]> { let q = supabase.from(this.tableName).select("*"); if (filters) Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) q = q.eq(k, v); }); const { data, error } = await q; if (error) throw error; return data || []; }
  async getById(id: string): Promise<ContratoData | null> { const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single(); if (error) throw error; return data; }
  async create(data: Omit<ContratoData, "id">): Promise<ContratoData> { const { data: result, error } = await supabase.from(this.tableName).insert(data).select().single(); if (error) throw error; return result; }
  async update(id: string, data: Partial<ContratoData>): Promise<ContratoData> { const { data: result, error } = await supabase.from(this.tableName).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async delete(id: string): Promise<void> { const { error } = await supabase.from(this.tableName).delete().eq("id", id); if (error) throw error; }
}
export const contratoService = new ContratoService();
export default contratoService;
