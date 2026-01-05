export interface Meta { id: string; colaboradorId: string; descricao: string; indicador: string; valorMeta: number; valorAtual: number; peso: number; prazo: Date; status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA"; }
export function calcularAtingimento(meta: Meta): number { return Math.min((meta.valorAtual / meta.valorMeta) * 100, 100); }
export default calcularAtingimento;
