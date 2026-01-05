export interface WorkflowAvaliacao { id: string; colaboradorId: string; avaliadorId: string; periodo: string; status: "PENDENTE" | "AUTOAVALIACAO" | "AVALIACAO_GESTOR" | "FEEDBACK" | "CONCLUIDA"; notaFinal?: number; metas: { descricao: string; peso: number; atingido: number }[]; }
export function criarWorkflowAvaliacao(colaboradorId: string, avaliadorId: string, periodo: string): WorkflowAvaliacao { return { id: `AVAL${Date.now()}`, colaboradorId, avaliadorId, periodo, status: "PENDENTE", metas: [] }; }
export default criarWorkflowAvaliacao;
