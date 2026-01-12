// V17.2-U007: Utilitários de Moeda Brasileira
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}
export function formatarNumero(valor: number, casas: number = 2): string {
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas }).format(valor);
}
export function parseMoeda(valor: string): number {
  return parseFloat(valor.replace(/[^\d,-]/g, '').replace('.', '').replace(',', '.'));
}
export function arredondar(valor: number, casas: number = 2): number {
  const fator = Math.pow(10, casas);
  return Math.round(valor * fator) / fator;
}
export function porExtenso(valor: number): string {
  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const dezenas = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
  if (valor === 0) return 'zero reais';
  const inteiro = Math.floor(valor);
  const centavos = Math.round((valor - inteiro) * 100);
  let resultado = '';
  if (inteiro > 0) resultado = `${inteiro} ${inteiro === 1 ? 'real' : 'reais'}`;
  if (centavos > 0) resultado += ` e ${centavos} centavos`;
  return resultado.trim();
}
