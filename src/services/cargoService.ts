import { supabase } from "@/integrations/supabase/client";
export interface CargoData { id?: string; nome?: string; descricao?: string; cbo?: string; nivel?: string; ativo?: boolean; }
class CargoService {
  private tableName = "cargos";
  async getAll(filters?: Record<string, any>): Promise<CargoData[]> { let q = supabase.from(this.tableName).select("*"); if (filters) Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) q = q.eq(k, v); }); const { data, error } = await q; if (error) throw error; return data || []; }
  async getById(id: string): Promise<CargoData | null> { const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single(); if (error) throw error; return data; }
  async create(data: Omit<CargoData, "id">): Promise<CargoData> { const { data: result, error } = await supabase.from(this.tableName).insert(data).select().single(); if (error) throw error; return result; }
  async update(id: string, data: Partial<CargoData>): Promise<CargoData> { const { data: result, error } = await supabase.from(this.tableName).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async delete(id: string): Promise<void> { const { error } = await supabase.from(this.tableName).delete().eq("id", id); if (error) throw error; }
}
export const cargoService = new CargoService();
export default cargoService;
