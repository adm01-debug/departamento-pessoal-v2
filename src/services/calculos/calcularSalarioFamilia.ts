const LIMITE_SALARIO_FAMILIA = 1912.45;
const VALOR_SALARIO_FAMILIA = 65.14;
export function calcularSalarioFamilia(salario: number, dependentesValidos: number): { valor: number; temDireito: boolean; valorPorDependente: number } {
  if (salario > LIMITE_SALARIO_FAMILIA || dependentesValidos <= 0) return { valor: 0, temDireito: false, valorPorDependente: 0 };
  const valor = VALOR_SALARIO_FAMILIA * dependentesValidos;
  return { valor: Math.round(valor * 100) / 100, temDireito: true, valorPorDependente: VALOR_SALARIO_FAMILIA };
}
export default calcularSalarioFamilia;
