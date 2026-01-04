/**
 * Formatador e Validador de CPF
 * Implementação completa com validação de dígitos verificadores
 */

/**
 * Remove caracteres não numéricos do CPF
 */
export function limparCPF(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

/**
 * Formata CPF no padrão XXX.XXX.XXX-XX
 */
export function formatarCPF(cpf: string): string {
  const numeros = limparCPF(cpf);
  if (numeros.length !== 11) return cpf;
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Máscara CPF para inputs (adiciona pontos e traço durante digitação)
 */
export function mascararCPF(valor: string): string {
  const numeros = limparCPF(valor);
  let resultado = '';
  
  for (let i = 0; i < Math.min(numeros.length, 11); i++) {
    if (i === 3 || i === 6) resultado += '.';
    if (i === 9) resultado += '-';
    resultado += numeros[i];
  }
  
  return resultado;
}

/**
 * Calcula o primeiro dígito verificador
 */
function calcularPrimeiroDigito(cpf: string): number {
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

/**
 * Calcula o segundo dígito verificador
 */
function calcularSegundoDigito(cpf: string): number {
  let soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

/**
 * Valida CPF completo (formato e dígitos verificadores)
 */
export function validarCPF(cpf: string): boolean {
  const numeros = limparCPF(cpf);
  
  // Verifica se tem 11 dígitos
  if (numeros.length !== 11) return false;
  
  // Verifica se não são todos iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(numeros)) return false;
  
  // Valida primeiro dígito
  const primeiroDigito = calcularPrimeiroDigito(numeros);
  if (primeiroDigito !== parseInt(numeros[9])) return false;
  
  // Valida segundo dígito
  const segundoDigito = calcularSegundoDigito(numeros);
  if (segundoDigito !== parseInt(numeros[10])) return false;
  
  return true;
}

/**
 * Gera CPF válido para testes (não usar em produção)
 */
export function gerarCPFValido(): string {
  const numeros = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
  const primeiroDigito = calcularPrimeiroDigito(numeros + '00');
  const cpfParcial = numeros + primeiroDigito;
  const segundoDigito = calcularSegundoDigito(cpfParcial + '0');
  return formatarCPF(cpfParcial + segundoDigito);
}

/**
 * Obtém estado de origem pelo prefixo do CPF
 */
export function obterEstadoOrigem(cpf: string): string {
  const numeros = limparCPF(cpf);
  if (numeros.length !== 11) return 'Desconhecido';
  
  const digito = parseInt(numeros[8]);
  const estados: Record<number, string> = {
    0: 'RS',
    1: 'DF, GO, MS, MT, TO',
    2: 'AC, AM, AP, PA, RO, RR',
    3: 'CE, MA, PI',
    4: 'AL, PB, PE, RN',
    5: 'BA, SE',
    6: 'MG',
    7: 'ES, RJ',
    8: 'SP',
    9: 'PR, SC'
  };
  
  return estados[digito] || 'Desconhecido';
}

/**
 * Oculta parte do CPF para exibição (XXX.XXX.XXX-XX -> ***.***.XXX-XX)
 */
export function ocultarCPF(cpf: string, caracteresVisiveis: number = 5): string {
  const formatado = formatarCPF(cpf);
  if (formatado.length !== 14) return cpf;
  
  const visivel = formatado.slice(-caracteresVisiveis);
  const oculto = formatado.slice(0, -caracteresVisiveis).replace(/\d/g, '*');
  
  return oculto + visivel;
}

/**
 * Verifica se dois CPFs são iguais (ignorando formatação)
 */
export function compararCPF(cpf1: string, cpf2: string): boolean {
  return limparCPF(cpf1) === limparCPF(cpf2);
}

export default {
  limparCPF,
  formatarCPF,
  mascararCPF,
  validarCPF,
  gerarCPFValido,
  obterEstadoOrigem,
  ocultarCPF,
  compararCPF
};
