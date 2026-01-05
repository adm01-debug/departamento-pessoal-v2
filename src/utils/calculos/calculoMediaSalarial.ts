export interface RemuneracaoMensal { competencia: string; salarioBase: number; horasExtras?: number; comissoes?: number; adicionais?: number; }
export interface MediaSalarialResult { mediaSalarioBase: number; mediaVariaveis: number; mediaTotal: number; mesesConsiderados: number; }
export function calculoMediaSalarial(remuneracoes: RemuneracaoMensal[], meses: number = 12): MediaSalarialResult {
  const dados = remuneracoes.slice(-meses);
  if (dados.length === 0) return { mediaSalarioBase: 0, mediaVariaveis: 0, mediaTotal: 0, mesesConsiderados: 0 };
  let totalBase = 0, totalVar = 0;
  dados.forEach(r => { totalBase += r.salarioBase; totalVar += (r.horasExtras || 0) + (r.comissoes || 0) + (r.adicionais || 0); });
  const n = dados.length;
  return { mediaSalarioBase: totalBase / n, mediaVariaveis: totalVar / n, mediaTotal: (totalBase + totalVar) / n, mesesConsiderados: n };
}
export default calculoMediaSalarial;
