// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";

export interface ServiceData {
  id?: string;
  nome?: string;
  descricao?: string;
  ativo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

class cacheServiceClass {
  private tableName = "items";

  async getAll(filters?: Record<string, any>): Promise<ServiceData[]> {
    let query = supabase.from(this.tableName).select("*");
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) query = query.eq(key, value);
      });
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<ServiceData | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async create(data: Omit<ServiceData, "id">): Promise<ServiceData> {
    const { data: result, error } = await supabase.from(this.tableName).insert(data).select().single();
    if (error) throw error;
    return result;
  }

  async update(id: string, data: Partial<ServiceData>): Promise<ServiceData> {
    const { data: result, error } = await supabase.from(this.tableName).update(data).eq("id", id).select().single();
    if (error) throw error;
    return result;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw error;
  }

  async count(filters?: Record<string, any>): Promise<number> {
    let query = supabase.from(this.tableName).select("*", { count: "exact", head: true });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) query = query.eq(key, value);
      });
    }
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }

  async exists(id: string): Promise<boolean> {
    const { count } = await supabase.from(this.tableName).select("*", { count: "exact", head: true }).eq("id", id);
    return (count || 0) > 0;
  }
}

export const cacheService = new cacheServiceClass();
export default cacheService;
