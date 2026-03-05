// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";
export interface EventoData { id?: string; colaboradorId: string; folhaId: string; rubricaId: string; tipo: string; quantidade?: number; referencia?: number; valor: number; origem: string; observacao?: string; }
class EventoService {
  private table = "eventos_folha";
  async getByFolha(folhaId: string): Promise<EventoData[]> { const { data, error } = await supabase.from(this.table).select("*").eq("folha_id", folhaId).order("rubrica_id"); if (error) throw error; return data || []; }
  async getByColaboradorFolha(colaboradorId: string, folhaId: string): Promise<EventoData[]> { const { data, error } = await supabase.from(this.table).select("*").eq("colaborador_id", colaboradorId).eq("folha_id", folhaId); if (error) throw error; return data || []; }
  async create(data: Omit<EventoData, "id">): Promise<EventoData> { const { data: result, error } = await supabase.from(this.table).insert(data).select().single(); if (error) throw error; return result; }
  async createMany(eventos: Omit<EventoData, "id">[]): Promise<EventoData[]> { const { data, error } = await supabase.from(this.table).insert(eventos).select(); if (error) throw error; return data || []; }
  async update(id: string, data: Partial<EventoData>): Promise<EventoData> { const { data: result, error } = await supabase.from(this.table).update(data).eq("id", id).select().single(); if (error) throw error; return result; }
  async delete(id: string): Promise<void> { const { error } = await supabase.from(this.table).delete().eq("id", id); if (error) throw error; }
  async deleteByFolha(folhaId: string): Promise<void> { const { error } = await supabase.from(this.table).delete().eq("folha_id", folhaId); if (error) throw error; }
}
export const eventoService = new EventoService();
export default eventoService;
