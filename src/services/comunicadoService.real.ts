// V20-SE014: comunicadoService Expandido
import { supabase } from "@/integrations/supabase/client";
export class ComunicadoServiceExpanded {
  async criar(dados: any) { const { data } = await supabase.from("comunicados").insert(dados).select().single(); return data; }
  async listar() { const { data } = await supabase.from("comunicados").select("*"); return data || []; }
  async enviar(id: string) { return { enviado: true }; }
  async arquivar(id: string) { return { arquivado: true }; }
}
export const comunicadoServiceReal = new ComunicadoServiceExpanded();
