export type StatusFerias = "SOLICITADA" | "ANALISE_RH" | "APROVACAO_GESTOR" | "APROVADA" | "PROGRAMADA" | "EM_GOZO" | "CONCLUIDA" | "CANCELADA";
export interface WorkflowFerias { id: string; colaboradorId: string; status: StatusFerias; periodoAquisitivo: { inicio: Date; fim: Date }; dataInicio: Date; dataFim: Date; diasGozo: number; diasAbono: number; diasVendidos: number; valorFerias?: number; valorAdiantamento13?: boolean; aprovadorId?: string; etapas: { etapa: string; status: string; data?: Date }[]; }
export const ETAPAS_FERIAS = ["Solicitação", "Análise RH", "Aprovação Gestor", "Cálculo", "Programação", "Pagamento", "Gozo", "Retorno"];
export function criarWorkflowFerias(dados: Partial<WorkflowFerias>): WorkflowFerias {
  return { id: `FER${Date.now()}`, colaboradorId: dados.colaboradorId!, status: "SOLICITADA", periodoAquisitivo: dados.periodoAquisitivo!, dataInicio: dados.dataInicio!, dataFim: dados.dataFim!, diasGozo: dados.diasGozo || 30, diasAbono: dados.diasAbono || 0, diasVendidos: dados.diasVendidos || 0, etapas: ETAPAS_FERIAS.map((e, i) => ({ etapa: e, status: i === 0 ? "EM_ANDAMENTO" : "PENDENTE" })) };
}
export function validarPeriodoFerias(dataInicio: Date, diasSolicitados: number, diasDisponiveis: number): { valido: boolean; erros: string[] } {
  const erros: string[] = [];
  if (diasSolicitados > diasDisponiveis) erros.push(`Dias solicitados (${diasSolicitados}) excedem disponíveis (${diasDisponiveis})`);
  if (diasSolicitados < 5) erros.push("Mínimo de 5 dias para gozo de férias");
  return { valido: erros.length === 0, erros };
}
export default criarWorkflowFerias;
