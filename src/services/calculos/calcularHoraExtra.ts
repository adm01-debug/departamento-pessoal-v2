export function calcularHoraExtra(salario: number, cargaHorariaMensal: number, horasExtras50: number, horasExtras100: number, horasNoturnas: number = 0): { valorHora: number; total50: number; total100: number; adicionalNoturno: number; total: number } {
  const valorHora = salario / cargaHorariaMensal;
  const total50 = valorHora * 1.5 * horasExtras50;
  const total100 = valorHora * 2 * horasExtras100;
  const adicionalNoturno = valorHora * 0.2 * horasNoturnas;
  const total = total50 + total100 + adicionalNoturno;
  return { valorHora: Math.round(valorHora * 100) / 100, total50: Math.round(total50 * 100) / 100, total100: Math.round(total100 * 100) / 100, adicionalNoturno: Math.round(adicionalNoturno * 100) / 100, total: Math.round(total * 100) / 100 };
}
export default calcularHoraExtra;
