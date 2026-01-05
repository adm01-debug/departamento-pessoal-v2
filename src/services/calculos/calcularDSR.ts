export function calcularDSR(valorHorasExtras: number, diasUteisMes: number, domingosEFeriados: number): number {
  if (diasUteisMes <= 0) return 0;
  const dsr = (valorHorasExtras / diasUteisMes) * domingosEFeriados;
  return Math.round(dsr * 100) / 100;
}
export function calcularDescontoDSR(salario: number, faltas: number): number {
  if (faltas <= 0) return 0;
  const valorDia = salario / 30;
  return Math.round(valorDia * faltas * 100) / 100;
}
export default calcularDSR;
