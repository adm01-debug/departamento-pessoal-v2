export interface HoraExtraInput { salarioBase: number; horasMensais: number; horasExtras50: number; horasExtras100: number; horasExtrasDomingo: number; horasExtrasNoturnas: number; adicionalNoturno?: number; }
export interface HoraExtraResult { valorHora: number; valorHE50: number; valorHE100: number; valorHEDomingo: number; valorHENoturna: number; totalHorasExtras: number; totalValor: number; }
export function calcularHoraExtra(input: HoraExtraInput): HoraExtraResult {
  const { salarioBase, horasMensais = 220, horasExtras50 = 0, horasExtras100 = 0, horasExtrasDomingo = 0, horasExtrasNoturnas = 0, adicionalNoturno = 20 } = input;
  const valorHora = salarioBase / horasMensais;
  const valorHE50 = horasExtras50 * valorHora * 1.5;
  const valorHE100 = horasExtras100 * valorHora * 2;
  const valorHEDomingo = horasExtrasDomingo * valorHora * 2;
  const fatorNoturno = 1 + adicionalNoturno / 100;
  const valorHENoturna = horasExtrasNoturnas * valorHora * 1.5 * fatorNoturno;
  const totalHorasExtras = horasExtras50 + horasExtras100 + horasExtrasDomingo + horasExtrasNoturnas;
  const totalValor = valorHE50 + valorHE100 + valorHEDomingo + valorHENoturna;
  return { valorHora: Number(valorHora.toFixed(2)), valorHE50: Number(valorHE50.toFixed(2)), valorHE100: Number(valorHE100.toFixed(2)), valorHEDomingo: Number(valorHEDomingo.toFixed(2)), valorHENoturna: Number(valorHENoturna.toFixed(2)), totalHorasExtras, totalValor: Number(totalValor.toFixed(2)) };
}
export function calcularHoraExtraIntrajornada(salarioBase: number, horasMensais: number = 220, horasIntrajornada: number): number {
  const valorHora = salarioBase / horasMensais;
  return Number((horasIntrajornada * valorHora * 1.5).toFixed(2));
}
export function calcularReflexoDSR(totalHorasExtras: number, valorTotalHE: number, diasUteis: number, domingosEFeriados: number): number {
  if (diasUteis === 0) return 0;
  return Number(((valorTotalHE / diasUteis) * domingosEFeriados).toFixed(2));
}
export default { calcularHoraExtra, calcularHoraExtraIntrajornada, calcularReflexoDSR };
