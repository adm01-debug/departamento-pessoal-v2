export interface HoraExtraInput { salarioBase: number; cargaHorariaMensal: number; horasExtras50: number; horasExtras100: number; horasExtraNoturna: number; adicionalNoturno?: number; }
export interface HoraExtraResult { valorHoraNormal: number; valorHoraExtra50: number; valorHoraExtra100: number; valorHoraExtraNoturna: number; totalHorasExtras: number; totalValor: number; }
export function calculoHoraExtra(input: HoraExtraInput): HoraExtraResult {
  const valorHoraNormal = input.salarioBase / input.cargaHorariaMensal;
  const valorHoraExtra50 = valorHoraNormal * 1.5;
  const valorHoraExtra100 = valorHoraNormal * 2.0;
  const adicNoturno = input.adicionalNoturno || 20;
  const valorHoraExtraNoturna = valorHoraNormal * 1.5 * (1 + adicNoturno / 100);
  const total50 = input.horasExtras50 * valorHoraExtra50;
  const total100 = input.horasExtras100 * valorHoraExtra100;
  const totalNoturna = input.horasExtraNoturna * valorHoraExtraNoturna;
  return { valorHoraNormal, valorHoraExtra50, valorHoraExtra100, valorHoraExtraNoturna, totalHorasExtras: input.horasExtras50 + input.horasExtras100 + input.horasExtraNoturna, totalValor: total50 + total100 + totalNoturna };
}
export function calcularReflexoDSR(valorHorasExtras: number, diasUteis: number, domingosEFeriados: number): number { return (valorHorasExtras / diasUteis) * domingosEFeriados; }
export default calculoHoraExtra;
