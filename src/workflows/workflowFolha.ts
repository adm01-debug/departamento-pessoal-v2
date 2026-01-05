export type StatusFolha = "ABERTA" | "IMPORTANDO_PONTO" | "CALCULANDO" | "CONFERENCIA" | "APROVACAO" | "FECHADA" | "TRANSMITIDA" | "PAGA";
export interface WorkflowFolha { id: string; competencia: string; status: StatusFolha; dataAbertura: Date; dataFechamento?: Date; totalColaboradores: number; totalProventos: number; totalDescontos: number; totalLiquido: number; etapas: { etapa: string; status: string; data?: Date; responsavel?: string }[]; inconsistencias: { colaborador: string; tipo: string; descricao: string }[]; }
export const ETAPAS_FOLHA = ["Abertura", "Importação Ponto", "Lançamentos", "Cálculo", "Conferência", "Aprovação", "Fechamento", "Transmissão eSocial", "Geração Guias", "Pagamento"];
export function criarWorkflowFolha(competencia: string): WorkflowFolha {
  return { id: `FOL${competencia.replace("-", "")}`, competencia, status: "ABERTA", dataAbertura: new Date(), totalColaboradores: 0, totalProventos: 0, totalDescontos: 0, totalLiquido: 0, etapas: ETAPAS_FOLHA.map((e, i) => ({ etapa: e, status: i === 0 ? "EM_ANDAMENTO" : "PENDENTE" })), inconsistencias: [] };
}
export function validarFechamentoFolha(workflow: WorkflowFolha): { podeFechar: boolean; pendencias: string[] } {
  const pendencias: string[] = [];
  if (workflow.inconsistencias.length > 0) pendencias.push(`${workflow.inconsistencias.length} inconsistências não resolvidas`);
  if (workflow.totalLiquido <= 0) pendencias.push("Folha sem valores calculados");
  return { podeFechar: pendencias.length === 0, pendencias };
}
export default criarWorkflowFolha;
