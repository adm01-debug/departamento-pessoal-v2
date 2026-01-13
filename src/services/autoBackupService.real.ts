// QA-FIX: AutoBackupService Real Implementation
import { supabase } from "@/integrations/supabase/client";

export class AutoBackupServiceReal {
  async listar() {
    const { data, error } = await supabase.from("autoBackup").select("*");
    if (error) throw error;
    return data || [];
  }

  async buscarPorId(id: string) {
    const { data, error } = await supabase.from("autoBackup").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  }

  async criar(dados: any) {
    const { data, error } = await supabase.from("autoBackup").insert(dados).select().single();
    if (error) throw error;
    return data;
  }

  async atualizar(id: string, dados: any) {
    const { data, error } = await supabase.from("autoBackup").update(dados).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async excluir(id: string) {
    const { error } = await supabase.from("autoBackup").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}

export const autoBackupServiceReal = new AutoBackupServiceReal();
export default autoBackupServiceReal;
