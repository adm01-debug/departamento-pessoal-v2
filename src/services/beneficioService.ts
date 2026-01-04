import { supabase } from "@/integrations/supabase/client";
export interface BeneficioData { id?: string; nome?: string; descricao?: string; valor?: number; tipo?: string; ativo?: boolean; }
class BeneficioService {
  private tableName = "beneficios";
  async getAll(filters?: Record<string, any>): Promise<BeneficioData[]> { let q = supabase.from(this.tableName).select("*"); if (filters) Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) q = q.eq(k, v); }); const { data, error } = await q; if (error) throw error; return data || []; }
  async getById(id: string): Promise<BeneficioData | null> { const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single(); if (error) throw error; return data; }
  async create(data: Omit<BeneficioData, "id">): Promise<BeneficioData> { const { data: result, error } = await supabase.from(this.tableName).insert(data).select().single(); if (error) throw error; return result; }
  async update(id: string, data: Partial<BeneficioData>): Promise<BeneficioData> { const { data: result, error } = await supabase.from(this.tableName).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async delete(id: string): Promise<void> { const { error } = await supabase.from(this.tableName).delete().eq("id", id); if (error) throw error; }
}
export const beneficioService = new BeneficioService();
export default beneficioService;
