// V15-307
export function calcularFerias(salarioBase: number, diasGozo: number, diasAbono: number = 0, mediaVariaveis: number = 0): { valorFerias: number; tercoConstitucional: number; valorAbono: number; tercoAbono: number; total: number } {
  const salarioTotal = salarioBase + mediaVariaveis;
  const valorDia = salarioTotal / 30;
  const valorFerias = valorDia * diasGozo;
  const tercoConstitucional = valorFerias / 3;
  const valorAbono = valorDia * diasAbono;
  const tercoAbono = valorAbono / 3;
  return { valorFerias, tercoConstitucional, valorAbono, tercoAbono, total: valorFerias + tercoConstitucional + valorAbono + tercoAbono };
}
export function calcularDiasFerias(dataInicio: Date, dataFim: Date): number {
  return Math.ceil((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}
