/**
 * Formatador e Validador de PIS/PASEP/NIT
 * Número de Identificação do Trabalhador
 */

/**
 * Remove caracteres não numéricos
 */
export function limparPIS(pis: string): string {
  return pis.replace(/\D/g, '');
}

/**
 * Formata PIS no padrão XXX.XXXXX.XX-X
 */
export function formatarPIS(pis: string): string {
  const numeros = limparPIS(pis);
  if (numeros.length !== 11) return pis;
  return numeros.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4');
}

/**
 * Máscara PIS para inputs
 */
export function mascararPIS(valor: string): string {
  const numeros = limparPIS(valor);
  let resultado = '';
  
  for (let i = 0; i < Math.min(numeros.length, 11); i++) {
    if (i === 3) resultado += '.';
    if (i === 8) resultado += '.';
    if (i === 10) resultado += '-';
    resultado += numeros[i];
  }
  
  return resultado;
}

/**
 * Calcula o dígito verificador do PIS
 */
function calcularDigitoVerificador(pis: string): number {
  const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  
  for (let i = 0; i < 10; i++) {
    soma += parseInt(pis[i]) * pesos[i];
  }
  
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

/**
 * Valida PIS/PASEP/NIT
 */
export function validarPIS(pis: string): boolean {
  const numeros = limparPIS(pis);
  
  if (numeros.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numeros)) return false;
  
  const digitoCalculado = calcularDigitoVerificador(numeros);
  const digitoInformado = parseInt(numeros[10]);
  
  return digitoCalculado === digitoInformado;
}

/**
 * Gera PIS válido para testes
 */
export function gerarPISValido(): string {
  const numeros = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
  const digito = calcularDigitoVerificador(numeros + '0');
  return formatarPIS(numeros + digito);
}

/**
 * Identifica o tipo do número (PIS, PASEP ou NIT)
 */
export function identificarTipo(pis: string): 'PIS' | 'PASEP' | 'NIT' | 'Desconhecido' {
  const numeros = limparPIS(pis);
  if (numeros.length !== 11) return 'Desconhecido';
  
  const primeiroDigito = numeros[0];
  
  // PIS: começa com 1
  if (primeiroDigito === '1') return 'PIS';
  
  // PASEP: começa com 2
  if (primeiroDigito === '2') return 'PASEP';
  
  // NIT: começa com outros números
  return 'NIT';
}

/**
 * Oculta parte do PIS
 */
export function ocultarPIS(pis: string): string {
  const formatado = formatarPIS(pis);
  if (formatado.length !== 14) return pis;
  return '***.' + formatado.slice(4, 10) + '.**-*';
}

/**
 * Compara dois PIS
 */
export function compararPIS(pis1: string, pis2: string): boolean {
  return limparPIS(pis1) === limparPIS(pis2);
}

/**
 * Extrai informações do PIS
 */
export function extrairInfoPIS(pis: string): { tipo: string; cadastro: string; digito: string } | null {
  const numeros = limparPIS(pis);
  if (numeros.length !== 11) return null;
  
  return {
    tipo: identificarTipo(pis),
    cadastro: numeros.substring(0, 10),
    digito: numeros[10]
  };
}

export default {
  limparPIS,
  formatarPIS,
  mascararPIS,
  validarPIS,
  gerarPISValido,
  identificarTipo,
  ocultarPIS,
  compararPIS,
  extrairInfoPIS
};
