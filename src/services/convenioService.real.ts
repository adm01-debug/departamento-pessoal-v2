// V20-SE016: convenioService Expandido
import { supabase } from "@/integrations/supabase/client";
export class ConvenioServiceExpanded {
  async listar() { const { data } = await supabase.from("convenios").select("*"); return data || []; }
  async criar(dados: any) { const { data } = await supabase.from("convenios").insert(dados).select().single(); return data; }
  async atualizar(id: string, dados: any) { const { data } = await supabase.from("convenios").update(dados).eq("id", id).select().single(); return data; }
  async excluir(id: string) { await supabase.from("convenios").delete().eq("id", id); return true; }
}
export const convenioServiceReal = new ConvenioServiceExpanded();
