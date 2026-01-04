/**
 * Formatador de Moedas
 * Suporte a BRL, USD, EUR e conversões
 */

type MoedaCodigo = 'BRL' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'ARS';

interface ConfiguracaoMoeda {
  locale: string;
  currency: string;
  simbolo: string;
  separadorDecimal: string;
  separadorMilhar: string;
}

const CONFIGURACOES: Record<MoedaCodigo, ConfiguracaoMoeda> = {
  BRL: { locale: 'pt-BR', currency: 'BRL', simbolo: 'R$', separadorDecimal: ',', separadorMilhar: '.' },
  USD: { locale: 'en-US', currency: 'USD', simbolo: '$', separadorDecimal: '.', separadorMilhar: ',' },
  EUR: { locale: 'de-DE', currency: 'EUR', simbolo: '€', separadorDecimal: ',', separadorMilhar: '.' },
  GBP: { locale: 'en-GB', currency: 'GBP', simbolo: '£', separadorDecimal: '.', separadorMilhar: ',' },
  JPY: { locale: 'ja-JP', currency: 'JPY', simbolo: '¥', separadorDecimal: '.', separadorMilhar: ',' },
  ARS: { locale: 'es-AR', currency: 'ARS', simbolo: '$', separadorDecimal: ',', separadorMilhar: '.' }
};

/**
 * Formata valor como moeda
 */
export function formatarMoeda(valor: number, moeda: MoedaCodigo = 'BRL'): string {
  const config = CONFIGURACOES[moeda];
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

/**
 * Formata valor sem símbolo da moeda
 */
export function formatarNumero(valor: number, casasDecimais: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais
  }).format(valor);
}

/**
 * Converte string formatada para número
 */
export function parseMoeda(valor: string): number {
  // Remove símbolo da moeda e espaços
  let limpo = valor.replace(/[R$€£¥\s]/g, '').trim();
  
  // Detecta formato (BR usa vírgula como decimal, US usa ponto)
  const ultimoSeparador = Math.max(limpo.lastIndexOf(','), limpo.lastIndexOf('.'));
  
  if (ultimoSeparador > -1) {
    const parteDecimal = limpo.substring(ultimoSeparador + 1);
    
    // Se tem exatamente 2 ou 3 dígitos após o separador, é decimal
    if (parteDecimal.length <= 3) {
      const parteInteira = limpo.substring(0, ultimoSeparador).replace(/[.,]/g, '');
      return parseFloat(`${parteInteira}.${parteDecimal}`);
    }
  }
  
  // Remove todos os separadores se não há decimal
  return parseFloat(limpo.replace(/[.,]/g, ''));
}

/**
 * Máscara de moeda para inputs
 */
export function mascararMoeda(valor: string, moeda: MoedaCodigo = 'BRL'): string {
  // Remove tudo que não é dígito
  const numeros = valor.replace(/\D/g, '');
  
  if (!numeros) return '';
  
  // Converte para centavos
  const centavos = parseInt(numeros, 10);
  const reais = centavos / 100;
  
  return formatarMoeda(reais, moeda);
}

/**
 * Formata valor por extenso
 */
export function valorPorExtenso(valor: number): string {
  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const dezenas = ['', 'dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const especiais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  if (valor === 0) return 'zero reais';
  if (valor === 100) return 'cem reais';

  const parteInteira = Math.floor(valor);
  const centavos = Math.round((valor - parteInteira) * 100);
  
  let extenso = '';
  
  // Milhões
  const milhoes = Math.floor(parteInteira / 1000000);
  if (milhoes > 0) {
    extenso += milhoes === 1 ? 'um milhão' : `${unidades[milhoes]} milhões`;
  }
  
  // Milhares
  const milhares = Math.floor((parteInteira % 1000000) / 1000);
  if (milhares > 0) {
    if (extenso) extenso += ' e ';
    extenso += milhares === 1 ? 'mil' : `${formatarCentena(milhares)} mil`;
  }
  
  // Centenas, dezenas e unidades
  const resto = parteInteira % 1000;
  if (resto > 0) {
    if (extenso) extenso += extenso.includes('mil') && resto < 100 ? ' e ' : ' ';
    extenso += formatarCentena(resto);
  }

  extenso += parteInteira === 1 ? ' real' : ' reais';

  if (centavos > 0) {
    extenso += ` e ${formatarCentena(centavos)} centavo${centavos > 1 ? 's' : ''}`;
  }

  return extenso;

  function formatarCentena(n: number): string {
    if (n === 0) return '';
    if (n === 100) return 'cem';
    
    let resultado = '';
    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;
    
    if (c > 0) resultado += centenas[c];
    
    if (d === 1 && u > 0) {
      if (resultado) resultado += ' e ';
      resultado += especiais[u];
    } else {
      if (d > 0) {
        if (resultado) resultado += ' e ';
        resultado += dezenas[d];
      }
      if (u > 0) {
        if (resultado) resultado += ' e ';
        resultado += unidades[u];
      }
    }
    
    return resultado;
  }
}

/**
 * Formata valor abreviado (1K, 1M, 1B)
 */
export function formatarAbreviado(valor: number, moeda: MoedaCodigo = 'BRL'): string {
  const config = CONFIGURACOES[moeda];
  
  if (valor >= 1e9) return `${config.simbolo} ${(valor / 1e9).toFixed(1)}B`;
  if (valor >= 1e6) return `${config.simbolo} ${(valor / 1e6).toFixed(1)}M`;
  if (valor >= 1e3) return `${config.simbolo} ${(valor / 1e3).toFixed(1)}K`;
  
  return formatarMoeda(valor, moeda);
}

/**
 * Calcula percentual
 */
export function formatarPercentual(valor: number, casasDecimais: number = 2): string {
  return `${valor.toFixed(casasDecimais)}%`;
}

export default {
  formatarMoeda,
  formatarNumero,
  parseMoeda,
  mascararMoeda,
  valorPorExtenso,
  formatarAbreviado,
  formatarPercentual
};
