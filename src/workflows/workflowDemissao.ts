export type StatusDemissao = "SOLICITADA" | "EM_ANALISE" | "APROVADA" | "EM_PROCESSAMENTO" | "DOCUMENTOS_PENDENTES" | "RESCISAO_CALCULADA" | "HOMOLOGACAO" | "CONCLUIDA" | "CANCELADA";
export interface WorkflowDemissao { id: string; colaboradorId: string; status: StatusDemissao; dataInicio: Date; dataPrevista: Date; tipo: "SEM_JUSTA_CAUSA" | "JUSTA_CAUSA" | "PEDIDO_DEMISSAO" | "ACORDO"; motivo: string; avisoPrevio: "TRABALHADO" | "INDENIZADO" | "DISPENSADO"; solicitanteId: string; aprovadorId?: string; etapas: { etapa: string; status: string; data?: Date; responsavel?: string }[]; }
export const ETAPAS_DEMISSAO = ["Solicitação", "Análise RH", "Aprovação Gestor", "Cálculo Rescisão", "Documentação", "Homologação", "Pagamento", "Conclusão"];
export function criarWorkflowDemissao(dados: Partial<WorkflowDemissao>): WorkflowDemissao {
  return { id: `DEM${Date.now()}`, colaboradorId: dados.colaboradorId!, status: "SOLICITADA", dataInicio: new Date(), dataPrevista: dados.dataPrevista || new Date(), tipo: dados.tipo || "SEM_JUSTA_CAUSA", motivo: dados.motivo || "", avisoPrevio: dados.avisoPrevio || "INDENIZADO", solicitanteId: dados.solicitanteId!, etapas: ETAPAS_DEMISSAO.map((e, i) => ({ etapa: e, status: i === 0 ? "EM_ANDAMENTO" : "PENDENTE" })) };
}
export function avancarEtapaDemissao(workflow: WorkflowDemissao): WorkflowDemissao {
  const etapaAtual = workflow.etapas.findIndex(e => e.status === "EM_ANDAMENTO");
  if (etapaAtual >= 0) { workflow.etapas[etapaAtual].status = "CONCLUIDO"; workflow.etapas[etapaAtual].data = new Date(); if (etapaAtual + 1 < workflow.etapas.length) workflow.etapas[etapaAtual + 1].status = "EM_ANDAMENTO"; }
  return workflow;
}
export default criarWorkflowDemissao;
