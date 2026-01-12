// V19-S008: DesligamentoService Real Expandido
import { supabase, handleSupabaseError } from "@/integrations/supabase/client";
export type MotivoDesligamento = "pedido_demissao" | "sem_justa_causa" | "justa_causa" | "acordo" | "termino_contrato" | "aposentadoria" | "falecimento";
export interface Desligamento { id: string; colaboradorId: string; data: string; motivo: MotivoDesligamento; avisoPrevio: boolean; diasAvisoPrevio: number; observacoes?: string; }
export const desligamentoServiceReal = {
  async registrar(dados: Omit<Desligamento, "id">) {
    const { data, error } = await supabase.from("desligamentos").insert(dados).select().single();
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },
  async buscar(colaboradorId: string) {
    const { data } = await supabase.from("desligamentos").select("*").eq("colaborador_id", colaboradorId).single();
    return data;
  },
  calcularAvisoPrevio(anosServico: number): number {
    return Math.min(30 + (anosServico * 3), 90);
  },
  async gerarTRCT(desligamentoId: string) {
    return { desligamentoId, documento: `TRCT_${desligamentoId}.pdf`, geradoEm: new Date().toISOString() };
  },
  async gerarSeguroDesemprego(desligamentoId: string) {
    return { desligamentoId, requerimento: `SD_${desligamentoId}.pdf` };
  },
  validarData: (data: string) => new Date(data) <= new Date()
};
export default desligamentoServiceReal;
