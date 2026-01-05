export function calcular13(salario: number, mesesTrabalhados: number, mediaVariaveis: number = 0): { valor: number; parcela1: number; parcela2: number; proporcional: boolean } {
  const salarioTotal = salario + mediaVariaveis;
  const proporcional = mesesTrabalhados < 12;
  const valor = (salarioTotal / 12) * Math.min(mesesTrabalhados, 12);
  const parcela1 = valor / 2;
  const parcela2 = valor - parcela1;
  return { valor: Math.round(valor * 100) / 100, parcela1: Math.round(parcela1 * 100) / 100, parcela2: Math.round(parcela2 * 100) / 100, proporcional };
}
export default calcular13;
