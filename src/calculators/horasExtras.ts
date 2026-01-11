// V15-309
export function calcularHoraExtra(salarioBase: number, cargaHorariaMensal: number, horas: number, percentual: number = 50): number {
  const valorHora = salarioBase / cargaHorariaMensal;
  return valorHora * (1 + percentual / 100) * horas;
}
export function calcularAdicionalNoturno(salarioBase: number, cargaHorariaMensal: number, horasNoturnas: number): number {
  const valorHora = salarioBase / cargaHorariaMensal;
  return valorHora * 0.2 * horasNoturnas;
}
export function calcularDSR(totalHorasExtras: number, diasUteis: number): number {
  const domingosEFeriados = Math.ceil(30 / 7);
  return (totalHorasExtras / diasUteis) * domingosEFeriados;
}
