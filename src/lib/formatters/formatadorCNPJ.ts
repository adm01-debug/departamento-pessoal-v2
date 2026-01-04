/**
 * Formatador e Validador de CNPJ
 * Implementação completa com validação de dígitos verificadores
 */

/**
 * Remove caracteres não numéricos do CNPJ
 */
export function limparCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

/**
 * Formata CNPJ no padrão XX.XXX.XXX/XXXX-XX
 */
export function formatarCNPJ(cnpj: string): string {
  const numeros = limparCNPJ(cnpj);
  if (numeros.length !== 14) return cnpj;
  return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Máscara CNPJ para inputs
 */
export function mascararCNPJ(valor: string): string {
  const numeros = limparCNPJ(valor);
  let resultado = '';
  
  for (let i = 0; i < Math.min(numeros.length, 14); i++) {
    if (i === 2 || i === 5) resultado += '.';
    if (i === 8) resultado += '/';
    if (i === 12) resultado += '-';
    resultado += numeros[i];
  }
  
  return resultado;
}

/**
 * Calcula o primeiro dígito verificador
 */
function calcularPrimeiroDigito(cnpj: string): number {
  const pesos = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpj[i]) * pesos[i];
  }
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

/**
 * Calcula o segundo dígito verificador
 */
function calcularSegundoDigito(cnpj: string): number {
  const pesos = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpj[i]) * pesos[i];
  }
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

/**
 * Valida CNPJ completo
 */
export function validarCNPJ(cnpj: string): boolean {
  const numeros = limparCNPJ(cnpj);
  
  if (numeros.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(numeros)) return false;
  
  const primeiroDigito = calcularPrimeiroDigito(numeros);
  if (primeiroDigito !== parseInt(numeros[12])) return false;
  
  const segundoDigito = calcularSegundoDigito(numeros);
  if (segundoDigito !== parseInt(numeros[13])) return false;
  
  return true;
}

/**
 * Gera CNPJ válido para testes
 */
export function gerarCNPJValido(): string {
  const numeros = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('') + '0001';
  const primeiroDigito = calcularPrimeiroDigito(numeros + '00');
  const cnpjParcial = numeros + primeiroDigito;
  const segundoDigito = calcularSegundoDigito(cnpjParcial + '0');
  return formatarCNPJ(cnpjParcial + segundoDigito);
}

/**
 * Extrai informações do CNPJ
 */
export function extrairInfoCNPJ(cnpj: string): { raiz: string; filial: string; digitos: string } | null {
  const numeros = limparCNPJ(cnpj);
  if (numeros.length !== 14) return null;
  
  return {
    raiz: numeros.substring(0, 8),
    filial: numeros.substring(8, 12),
    digitos: numeros.substring(12, 14)
  };
}

/**
 * Verifica se é matriz (filial 0001)
 */
export function isMatriz(cnpj: string): boolean {
  const info = extrairInfoCNPJ(cnpj);
  return info?.filial === '0001';
}

/**
 * Oculta parte do CNPJ
 */
export function ocultarCNPJ(cnpj: string): string {
  const formatado = formatarCNPJ(cnpj);
  if (formatado.length !== 18) return cnpj;
  return formatado.slice(0, 3) + '***' + formatado.slice(6, 9) + '***' + formatado.slice(12);
}

/**
 * Compara dois CNPJs
 */
export function compararCNPJ(cnpj1: string, cnpj2: string): boolean {
  return limparCNPJ(cnpj1) === limparCNPJ(cnpj2);
}

/**
 * Formata CPF ou CNPJ automaticamente
 */
export function formatarCPFouCNPJ(documento: string): string {
  const numeros = documento.replace(/\D/g, '');
  if (numeros.length === 11) {
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (numeros.length === 14) {
    return formatarCNPJ(numeros);
  }
  return documento;
}

export default {
  limparCNPJ,
  formatarCNPJ,
  mascararCNPJ,
  validarCNPJ,
  gerarCNPJValido,
  extrairInfoCNPJ,
  isMatriz,
  ocultarCNPJ,
  compararCNPJ,
  formatarCPFouCNPJ
};
