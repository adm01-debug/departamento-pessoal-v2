export type StatusPonto = "ABERTO" | "IMPORTADO" | "TRATADO" | "APROVADO" | "FECHADO";
export interface WorkflowPonto { id: string; competencia: string; status: StatusPonto; totalRegistros: number; inconsistencias: number; horasExtras: number; faltas: number; }
export function criarWorkflowPonto(competencia: string): WorkflowPonto { return { id: `PTO${competencia}`, competencia, status: "ABERTO", totalRegistros: 0, inconsistencias: 0, horasExtras: 0, faltas: 0 }; }
export default criarWorkflowPonto;
