export function calcularFerias(salario: number, diasFerias: number, diasAbono = 0): { ferias: number; terco: number; abono: number; total: number } {
  const valorDia = salario / 30;
  const ferias = valorDia * diasFerias;
  const terco = ferias / 3;
  const abono = valorDia * diasAbono;
  const total = ferias + terco + abono + (abono / 3);
  return { ferias: Math.round(ferias * 100) / 100, terco: Math.round(terco * 100) / 100, abono: Math.round(abono * 100) / 100, total: Math.round(total * 100) / 100 };
}
export function calcularDiasFerias(dataAdmissao: Date, dataReferencia: Date): number {
  const mesesTrabalhados = Math.floor((dataReferencia.getTime() - dataAdmissao.getTime()) / (1000 * 60 * 60 * 24 * 30));
  if (mesesTrabalhados < 12) return Math.floor((mesesTrabalhados / 12) * 30);
  return 30;
}
export function calcularProvisaoFerias(salario: number): number {
  const feriasProvisao = salario / 12;
  const tercoProvisao = feriasProvisao / 3;
  return Math.round((feriasProvisao + tercoProvisao) * 100) / 100;
}
export default { calcularFerias, calcularDiasFerias, calcularProvisaoFerias };
