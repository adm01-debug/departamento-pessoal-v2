import { supabase } from "@/integrations/supabase/client";
export interface PontoData { id?: string; colaboradorId?: string; dataRegistro?: Date; horaEntrada?: string; horaSaida?: string; tipo?: string; }
class PontoService {
  private tableName = "ponto";
  async getAll(filters?: Record<string, any>): Promise<PontoData[]> { let q = supabase.from(this.tableName).select("*"); if (filters) Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) q = q.eq(k, v); }); const { data, error } = await q; if (error) throw error; return data || []; }
  async getById(id: string): Promise<PontoData | null> { const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single(); if (error) throw error; return data; }
  async create(data: Omit<PontoData, "id">): Promise<PontoData> { const { data: result, error } = await supabase.from(this.tableName).insert(data).select().single(); if (error) throw error; return result; }
  async update(id: string, data: Partial<PontoData>): Promise<PontoData> { const { data: result, error } = await supabase.from(this.tableName).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async delete(id: string): Promise<void> { const { error } = await supabase.from(this.tableName).delete().eq("id", id); if (error) throw error; }
}
export const pontoService = new PontoService();
export default pontoService;
