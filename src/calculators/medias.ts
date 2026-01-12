// V17-C008: Calculadora de Médias (13º, Férias)
export interface ValorVariavel {
  competencia: string;
  valor: number;
}

export function calcularMedia(valores: ValorVariavel[], meses: number = 12): number {
  if (valores.length === 0) return 0;
  const mesesCalculo = Math.min(valores.length, meses);
  const soma = valores.slice(-mesesCalculo).reduce((acc, v) => acc + v.valor, 0);
  return Math.round((soma / mesesCalculo) * 100) / 100;
}

export function calcularMediaHorasExtras(horasExtras: ValorVariavel[]): number {
  return calcularMedia(horasExtras);
}

export function calcularMediaComissoes(comissoes: ValorVariavel[]): number {
  return calcularMedia(comissoes);
}

export function calcularMediaAdicionais(adicionais: ValorVariavel[]): number {
  return calcularMedia(adicionais);
}
