export interface WorkflowPromocao { id: string; colaboradorId: string; cargoAtual: string; cargoNovo: string; salarioAtual: number; salarioNovo: number; dataEfetivacao: Date; status: "SOLICITADA" | "APROVADA" | "EFETIVADA"; }
export function criarWorkflowPromocao(colaboradorId: string, cargoNovo: string, salarioNovo: number): WorkflowPromocao { return { id: `PROM${Date.now()}`, colaboradorId, cargoAtual: "", cargoNovo, salarioAtual: 0, salarioNovo, dataEfetivacao: new Date(), status: "SOLICITADA" }; }
export default criarWorkflowPromocao;
