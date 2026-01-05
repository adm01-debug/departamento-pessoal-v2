export interface PesquisaClima { id: string; titulo: string; dataInicio: Date; dataFim: Date; perguntas: { id: string; texto: string; tipo: "ESCALA" | "TEXTO" | "MULTIPLA" }[]; anonima: boolean; }
export interface RespostaClima { pesquisaId: string; colaboradorId?: string; respostas: { perguntaId: string; valor: any }[]; dataResposta: Date; }
export function calcularNPS(respostas: number[]): number { const promotores = respostas.filter(r => r >= 9).length; const detratores = respostas.filter(r => r <= 6).length; return ((promotores - detratores) / respostas.length) * 100; }
export default calcularNPS;
