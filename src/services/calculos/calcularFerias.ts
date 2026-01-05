export function calcularFerias(salario: number, diasGozo: number, diasAbono: number = 0, mediaVariaveis: number = 0): { valorFerias: number; tercoFerias: number; valorAbono: number; tercoAbono: number; totalBruto: number } {
  const salarioTotal = salario + mediaVariaveis;
  const valorDia = salarioTotal / 30;
  const valorFerias = valorDia * diasGozo;
  const tercoFerias = valorFerias / 3;
  const valorAbono = valorDia * diasAbono;
  const tercoAbono = valorAbono / 3;
  const totalBruto = valorFerias + tercoFerias + valorAbono + tercoAbono;
  return { valorFerias: Math.round(valorFerias * 100) / 100, tercoFerias: Math.round(tercoFerias * 100) / 100, valorAbono: Math.round(valorAbono * 100) / 100, tercoAbono: Math.round(tercoAbono * 100) / 100, totalBruto: Math.round(totalBruto * 100) / 100 };
}
export default calcularFerias;
