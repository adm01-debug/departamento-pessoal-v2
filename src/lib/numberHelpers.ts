/**
 * Formata número como moeda brasileira
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

/**
 * Formata número com casas decimais
 */
export function formatarNumero(valor: number, decimais = 2): string {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimais, maximumFractionDigits: decimais }).format(valor);
}

/**
 * Formata porcentagem
 */
export function formatarPorcentagem(valor: number, decimais = 1): string {
  return new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: decimais, maximumFractionDigits: decimais }).format(valor / 100);
}

/**
 * Arredonda para cima
 */
export function arredondarCima(valor: number, casas = 2): number {
  const fator = Math.pow(10, casas);
  return Math.ceil(valor * fator) / fator;
}

/**
 * Arredonda para baixo
 */
export function arredondarBaixo(valor: number, casas = 2): number {
  const fator = Math.pow(10, casas);
  return Math.floor(valor * fator) / fator;
}

/**
 * Calcula percentual
 */
export function calcularPercentual(parte: number, total: number): number {
  if (total === 0) return 0;
  return (parte / total) * 100;
}

/**
 * Clamp de valor
 */
export function clamp(valor: number, min: number, max: number): number {
  return Math.min(Math.max(valor, min), max);
}
