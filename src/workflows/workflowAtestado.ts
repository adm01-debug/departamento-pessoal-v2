export interface WorkflowAtestado { id: string; colaboradorId: string; dataInicio: Date; dataFim: Date; dias: number; cid?: string; crm: string; status: "PENDENTE" | "VALIDADO" | "LANCADO" | "REJEITADO"; }
export function criarWorkflowAtestado(colaboradorId: string, dataInicio: Date, dias: number): WorkflowAtestado { return { id: `ATEST${Date.now()}`, colaboradorId, dataInicio, dataFim: new Date(dataInicio.getTime() + dias * 86400000), dias, crm: "", status: "PENDENTE" }; }
export default criarWorkflowAtestado;
