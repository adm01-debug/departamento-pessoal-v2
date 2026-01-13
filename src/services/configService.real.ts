// V20-SE015: configService Expandido
import { supabase } from "@/integrations/supabase/client";
export class ConfigServiceExpanded {
  async get(chave: string) { const { data } = await supabase.from("configs").select("valor").eq("chave", chave).single(); return data?.valor; }
  async set(chave: string, valor: any) { const { data } = await supabase.from("configs").upsert({ chave, valor }).select().single(); return data; }
  async listar() { const { data } = await supabase.from("configs").select("*"); return data || []; }
  async resetar() { return { resetado: true }; }
}
export const configServiceReal = new ConfigServiceExpanded();
