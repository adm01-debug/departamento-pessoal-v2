export interface WorkflowTransferencia { id: string; colaboradorId: string; unidadeOrigem: string; unidadeDestino: string; dataTransferencia: Date; status: "SOLICITADA" | "APROVADA" | "EFETIVADA"; motivo: string; }
export function criarWorkflowTransferencia(colaboradorId: string, destino: string, data: Date): WorkflowTransferencia { return { id: `TRANS${Date.now()}`, colaboradorId, unidadeOrigem: "", unidadeDestino: destino, dataTransferencia: data, status: "SOLICITADA", motivo: "" }; }
export default criarWorkflowTransferencia;
