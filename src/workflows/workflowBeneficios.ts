export type StatusBeneficio = "SOLICITADO" | "ANALISE" | "APROVADO" | "ATIVO" | "SUSPENSO" | "CANCELADO";
export interface WorkflowBeneficio { id: string; colaboradorId: string; beneficioId: string; status: StatusBeneficio; dataInicio: Date; dataFim?: Date; valor: number; }
export function criarWorkflowBeneficio(colaboradorId: string, beneficioId: string, valor: number): WorkflowBeneficio { return { id: `BEN${Date.now()}`, colaboradorId, beneficioId, status: "SOLICITADO", dataInicio: new Date(), valor }; }
export default criarWorkflowBeneficio;
