/**
 * @fileoverview Funções de validação centralizadas
 * @module lib/validations
 * @version V8.2 - QA Fix - Regex corrigido
 */

// ============================================
// VALIDAÇÃO DE DOCUMENTOS
// ============================================

/**
 * Valida CPF
 */
export function validarCPF(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  if (cpfLimpo.length !== 11) return false;
  // Rejeita CPFs com todos os dígitos iguais
  if (/^(\d)\1+$/.test(cpfLimpo)) return false;
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo[9])) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpfLimpo[10]);
}

/**
 * Valida CNPJ
 */
export function validarCNPJ(cnpj: string): boolean {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  
  if (cnpjLimpo.length !== 14) return false;
  // Rejeita CNPJs com todos os dígitos iguais
  if (/^(\d)\1+$/.test(cnpjLimpo)) return false;
  
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let soma = 0;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cnpjLimpo[i]) * pesos1[i];
  }
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;
  if (digito1 !== parseInt(cnpjLimpo[12])) return false;
  
  soma = 0;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cnpjLimpo[i]) * pesos2[i];
  }
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;
  return digito2 === parseInt(cnpjLimpo[13]);
}

/**
 * Valida PIS/PASEP
 */
export function validarPIS(pis: string): boolean {
  const pisLimpo = pis.replace(/\D/g, '');
  
  if (pisLimpo.length !== 11) return false;
  // Rejeita PIS com todos os dígitos iguais
  if (/^(\d)\1+$/.test(pisLimpo)) return false;
  
  const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  
  for (let i = 0; i < 10; i++) {
    soma += parseInt(pisLimpo[i]) * pesos[i];
  }
  
  const resto = soma % 11;
  const digito = resto < 2 ? 0 : 11 - resto;
  
  return digito === parseInt(pisLimpo[10]);
}

/**
 * Valida RG (validação básica - formato varia por estado)
 */
export function validarRG(rg: string): boolean {
  const rgLimpo = rg.replace(/[^\dXx]/g, '');
  return rgLimpo.length >= 5 && rgLimpo.length <= 14;
}

/**
 * Valida CTPS (Carteira de Trabalho)
 */
export function validarCTPS(numero: string, serie: string): boolean {
  const numLimpo = numero.replace(/\D/g, '');
  const serieLimpa = serie.replace(/\D/g, '');
  return numLimpo.length >= 5 && serieLimpa.length >= 3;
}

// ============================================
// VALIDAÇÃO DE CONTATO
// ============================================

/**
 * Valida email
 */
export function validarEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Valida telefone/celular brasileiro
 */
export function validarTelefone(telefone: string): boolean {
  const telLimpo = telefone.replace(/\D/g, '');
  // 10 dígitos (fixo) ou 11 dígitos (celular)
  return telLimpo.length >= 10 && telLimpo.length <= 11;
}

/**
 * Valida celular brasileiro (deve ter 11 dígitos e começar com 9)
 */
export function validarCelular(celular: string): boolean {
  const celLimpo = celular.replace(/\D/g, '');
  if (celLimpo.length !== 11) return false;
  // O terceiro dígito (após DDD) deve ser 9
  return celLimpo[2] === '9';
}

/**
 * Valida CEP
 */
export function validarCEP(cep: string): boolean {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.length === 8;
}

// ============================================
// VALIDAÇÃO DE DATAS
// ============================================

/**
 * Valida se data é válida
 */
export function validarData(data: string): boolean {
  if (!data) return false;
  const d = new Date(data);
  return !isNaN(d.getTime());
}

/**
 * Valida se data de nascimento é válida (idade mínima 14 anos para menor aprendiz)
 */
export function validarDataNascimento(dataNascimento: string, idadeMinima: number = 14): boolean {
  const data = new Date(dataNascimento);
  if (isNaN(data.getTime())) return false;
  
  // Não pode ser data futura
  const hoje = new Date();
  if (data > hoje) return false;
  
  const idade = hoje.getFullYear() - data.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = data.getMonth();
  
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < data.getDate())) {
    return idade - 1 >= idadeMinima;
  }
  return idade >= idadeMinima;
}

/**
 * Valida data de admissão (não pode ser futura, máximo 30 dias no futuro para pré-admissão)
 */
export function validarDataAdmissao(dataAdmissao: string, permitirFuturo: boolean = false): boolean {
  const data = new Date(dataAdmissao);
  if (isNaN(data.getTime())) return false;
  
  const hoje = new Date();
  if (permitirFuturo) {
    // Permite até 30 dias no futuro para pré-admissão
    const limite = new Date(hoje);
    limite.setDate(limite.getDate() + 30);
    return data <= limite;
  }
  return data <= hoje;
}

/**
 * Valida competência no formato YYYY-MM
 */
export function validarCompetencia(competencia: string): boolean {
  if (!competencia) return false;
  const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
  return regex.test(competencia);
}

/**
 * Calcula idade a partir da data de nascimento
 */
export function calcularIdade(dataNascimento: string): number {
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = nascimento.getMonth();
  
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}

// ============================================
// FORMATAÇÃO
// ============================================

/**
 * Formata CPF
 */
export function formatarCPF(cpf: string): string {
  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length !== 11) return cpf;
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ
 */
export function formatarCNPJ(cnpj: string): string {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  if (cnpjLimpo.length !== 14) return cnpj;
  return cnpjLimpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formata telefone
 */
export function formatarTelefone(telefone: string): string {
  const telLimpo = telefone.replace(/\D/g, '');
  if (telLimpo.length === 11) {
    return telLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (telLimpo.length === 10) {
    return telLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
}

/**
 * Formata CEP
 */
export function formatarCEP(cep: string): string {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) return cep;
  return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Formata PIS
 */
export function formatarPIS(pis: string): string {
  const pisLimpo = pis.replace(/\D/g, '');
  if (pisLimpo.length !== 11) return pis;
  return pisLimpo.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4');
}

/**
 * Formata valor monetário
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Formata percentual
 */
export function formatarPercentual(valor: number, casasDecimais: number = 2): string {
  return `${valor.toFixed(casasDecimais)}%`;
}

// ============================================
// SANITIZAÇÃO
// ============================================

/**
 * Remove caracteres especiais de documento
 */
export function limparDocumento(doc: string): string {
  return doc.replace(/\D/g, '');
}

/**
 * Sanitiza nome (uppercase, trim, remover múltiplos espaços)
 */
export function sanitizarNome(nome: string): string {
  return nome
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Sanitiza email
 */
export function sanitizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Sanitiza texto genérico (remove caracteres perigosos)
 */
export function sanitizarTexto(texto: string): string {
  return texto
    .trim()
    .replace(/[<>\"\'&]/g, '')
    .replace(/\s+/g, ' ');
}

// ============================================
// VALIDAÇÃO DE VALORES
// ============================================

/**
 * Valida valor monetário positivo
 */
export function validarValorMonetario(valor: number): boolean {
  return typeof valor === 'number' && !isNaN(valor) && isFinite(valor) && valor >= 0;
}

/**
 * Valida salário (deve ser >= salário mínimo)
 */
export function validarSalario(salario: number, salarioMinimo: number = 1518): boolean {
  return validarValorMonetario(salario) && salario >= salarioMinimo;
}

/**
 * Valida quantidade de horas (0-24 por dia, 0-744 por mês)
 */
export function validarHoras(horas: number, maxPorDia: boolean = false): boolean {
  if (!validarValorMonetario(horas)) return false;
  const limite = maxPorDia ? 24 : 744;
  return horas <= limite;
}

/**
 * Valida percentual (0-100)
 */
export function validarPercentual(valor: number): boolean {
  return typeof valor === 'number' && !isNaN(valor) && valor >= 0 && valor <= 100;
}

// ============================================
// VALIDAÇÃO DE BANCO
// ============================================

/**
 * Valida código do banco (3 dígitos)
 */
export function validarCodigoBanco(codigo: string): boolean {
  const codigoLimpo = codigo.replace(/\D/g, '');
  return codigoLimpo.length === 3;
}

/**
 * Valida agência bancária
 */
export function validarAgencia(agencia: string): boolean {
  const agenciaLimpa = agencia.replace(/\D/g, '');
  return agenciaLimpa.length >= 4 && agenciaLimpa.length <= 6;
}

/**
 * Valida conta bancária
 */
export function validarConta(conta: string): boolean {
  const contaLimpa = conta.replace(/[^\dXx]/g, '');
  return contaLimpa.length >= 5 && contaLimpa.length <= 15;
}

/**
 * Valida chave PIX
 */
export function validarChavePix(chave: string, tipo: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria'): boolean {
  switch (tipo) {
    case 'cpf':
      return validarCPF(chave);
    case 'cnpj':
      return validarCNPJ(chave);
    case 'email':
      return validarEmail(chave);
    case 'telefone':
      return validarCelular(chave);
    case 'aleatoria':
      return chave.length === 36 && /^[a-f0-9-]+$/i.test(chave);
    default:
      return false;
  }
}

// ============================================
// EXPORTS AGRUPADOS
// ============================================

export const documentos = {
  validarCPF,
  validarCNPJ,
  validarPIS,
  validarRG,
  validarCTPS,
  formatarCPF,
  formatarCNPJ,
  formatarPIS,
  limparDocumento,
};

export const contato = {
  validarEmail,
  validarTelefone,
  validarCelular,
  validarCEP,
  formatarTelefone,
  formatarCEP,
  sanitizarEmail,
};

export const datas = {
  validarData,
  validarDataNascimento,
  validarDataAdmissao,
  validarCompetencia,
  calcularIdade,
};

export const valores = {
  validarValorMonetario,
  validarSalario,
  validarHoras,
  validarPercentual,
  formatarMoeda,
  formatarPercentual,
};

export const banco = {
  validarCodigoBanco,
  validarAgencia,
  validarConta,
  validarChavePix,
};

export const texto = {
  sanitizarNome,
  sanitizarEmail,
  sanitizarTexto,
};
