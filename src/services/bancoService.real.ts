// V19-S003: BancoService Real Expandido
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
export interface DadosBancarios { id: string; colaboradorId: string; banco: string; agencia: string; conta: string; tipoConta: "corrente" | "poupanca"; pix?: string; }
export const bancoServiceReal = {
  async salvar(dados: Omit<DadosBancarios, "id">) {
    const { data, error } = await supabase.from("dados_bancarios").upsert(dados, { onConflict: "colaborador_id" }).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async buscar(colaboradorId: string) {
    const { data } = await supabase.from("dados_bancarios").select("*").eq("colaborador_id", colaboradorId).single();
    return data;
  },
  async listarBancos() {
    return [
      { codigo: "001", nome: "Banco do Brasil" },
      { codigo: "104", nome: "Caixa Econômica" },
      { codigo: "237", nome: "Bradesco" },
      { codigo: "341", nome: "Itaú" },
      { codigo: "033", nome: "Santander" },
      { codigo: "756", nome: "Sicoob" },
      { codigo: "077", nome: "Inter" },
      { codigo: "260", nome: "Nubank" }
    ];
  },
  validarAgencia: (agencia: string) => /^\d{4}(-\d)?$/.test(agencia),
  validarConta: (conta: string) => /^\d{5,12}(-\d)?$/.test(conta),
  formatarAgencia: (agencia: string) => agencia.replace(/\D/g, "").padStart(4, "0"),
  formatarConta: (conta: string) => conta.replace(/\D/g, "")
};
export default bancoServiceReal;
