export type StatusESocial = "PENDENTE" | "GERANDO" | "VALIDANDO" | "TRANSMITINDO" | "PROCESSANDO" | "ACEITO" | "REJEITADO";
export interface WorkflowESocial { id: string; evento: string; competencia: string; status: StatusESocial; protocolo?: string; recibo?: string; erros: string[]; }
export function criarWorkflowESocial(evento: string, competencia: string): WorkflowESocial { return { id: `ESO${Date.now()}`, evento, competencia, status: "PENDENTE", erros: [] }; }
export default criarWorkflowESocial;
