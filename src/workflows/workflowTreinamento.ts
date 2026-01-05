export interface WorkflowTreinamento { id: string; colaboradorId: string; treinamentoId: string; dataInicio: Date; dataFim: Date; cargaHoraria: number; status: "INSCRITO" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO"; nota?: number; }
export function criarWorkflowTreinamento(colaboradorId: string, treinamentoId: string): WorkflowTreinamento { return { id: `TREIN${Date.now()}`, colaboradorId, treinamentoId, dataInicio: new Date(), dataFim: new Date(), cargaHoraria: 0, status: "INSCRITO" }; }
export default criarWorkflowTreinamento;
