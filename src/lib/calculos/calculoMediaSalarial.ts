export interface RemuneracaoMensal { competencia: string; salarioBase: number; horasExtras?: number; comissoes?: number; adicionais?: number; dsrSobreVariaveis?: number; }
export interface MediaSalarialInput { remuneracoes: RemuneracaoMensal[]; mesesConsiderar?: number; incluirVariaveis?: boolean; }
export interface MediaSalarialResult { mediaSimples: number; mediaComVariaveis: number; mesesConsiderados: number; maiorRemuneracao: number; menorRemuneracao: number; totalRemuneracoes: number; detalhamento: { competencia: string; total: number }[]; }
export function calcularMediaSalarial(input: MediaSalarialInput): MediaSalarialResult {
  const { remuneracoes, mesesConsiderar = 12, incluirVariaveis = true } = input;
  const ordenadas = [...remuneracoes].sort((a, b) => b.competencia.localeCompare(a.competencia)).slice(0, mesesConsiderar);
  if (ordenadas.length === 0) return { mediaSimples: 0, mediaComVariaveis: 0, mesesConsiderados: 0, maiorRemuneracao: 0, menorRemuneracao: 0, totalRemuneracoes: 0, detalhamento: [] };
  const detalhamento = ordenadas.map(r => {
    const variaveis = incluirVariaveis ? (r.horasExtras || 0) + (r.comissoes || 0) + (r.adicionais || 0) + (r.dsrSobreVariaveis || 0) : 0;
    return { competencia: r.competencia, total: r.salarioBase + variaveis };
  });
  const totais = detalhamento.map(d => d.total);
  const totalRemuneracoes = totais.reduce((a, b) => a + b, 0);
  const mediaSalarios = ordenadas.reduce((a, r) => a + r.salarioBase, 0) / ordenadas.length;
  return {
    mediaSimples: Number(mediaSalarios.toFixed(2)),
    mediaComVariaveis: Number((totalRemuneracoes / ordenadas.length).toFixed(2)),
    mesesConsiderados: ordenadas.length,
    maiorRemuneracao: Math.max(...totais),
    menorRemuneracao: Math.min(...totais),
    totalRemuneracoes: Number(totalRemuneracoes.toFixed(2)),
    detalhamento,
  };
}
export function calcularMediaFerias(remuneracoes: RemuneracaoMensal[]): number {
  const resultado = calcularMediaSalarial({ remuneracoes, mesesConsiderar: 12, incluirVariaveis: true });
  return resultado.mediaComVariaveis;
}
export function calcularMedia13(remuneracoes: RemuneracaoMensal[]): number {
  const resultado = calcularMediaSalarial({ remuneracoes, mesesConsiderar: 12, incluirVariaveis: true });
  return resultado.mediaComVariaveis;
}
export default { calcularMediaSalarial, calcularMediaFerias, calcularMedia13 };
