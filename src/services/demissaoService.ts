import { supabase } from "@/integrations/supabase/client";

export interface DemissaoData {
  id?: string;
  colaboradorId?: string;
  dataDemissao?: Date;
  motivo?: string;
  tipoAviso?: string;
  valorRescisao?: number;
  status?: string;
  ativo?: boolean;
}

class DemissaoService {
  private tableName = "demissoes";

  async getAll(filters?: Record<string, any>): Promise<DemissaoData[]> {
    let query = supabase.from(this.tableName).select("*");
    if (filters) Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) query = query.eq(k, v); });
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<DemissaoData | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async create(data: Omit<DemissaoData, "id">): Promise<DemissaoData> {
    const { data: result, error } = await supabase.from(this.tableName).insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async update(id: string, data: Partial<DemissaoData>): Promise<DemissaoData> {
    const { data: result, error } = await supabase.from(this.tableName).update(data).eq("id", id).select().single();
    if (error) throw error;
    return result;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw error;
  }
}

export const demissaoService = new DemissaoService();
export default demissaoService;
