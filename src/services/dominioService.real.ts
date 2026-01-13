// V20-SE019: dominioService Expandido
import { supabase } from "@/integrations/supabase/client";
export class DominioServiceExpanded {
  async listar(tipo: string) { const { data } = await supabase.from("dominios").select("*").eq("tipo", tipo); return data || []; }
  async criar(dados: any) { const { data } = await supabase.from("dominios").insert(dados).select().single(); return data; }
  async atualizar(id: string, dados: any) { const { data } = await supabase.from("dominios").update(dados).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("dominios").delete().eq("id", id); return true; }
}
export const dominioServiceReal = new DominioServiceExpanded();
