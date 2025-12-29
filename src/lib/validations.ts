/**
 * @fileoverview Funções de validação centralizadas
 * @module lib/validations
 * @version V8.1
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
  
  const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let soma = 0;
  
  for (let i = 0; i < 10; i++) {
    soma += parseInt(pisLimpo[i]) * pesos[i];
  }
  
  const resto = soma % 11;
  const digito = resto < 2 ? 0 : 11 - resto;
  
  return digito === parseInt(pisLimpo[10]);
}

// ============================================
// VALIDAÇÃO DE CONTATO
// ============================================

/**
 * Valida email
 */
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Valida telefone/celular brasileiro
 */
export function validarTelefone(telefone: string): boolean {
  const telLimpo = telefone.replace(/\D/g, '');
  return telLimpo.length >= 10 && telLimpo.length <= 11;
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
  const d = new Date(data);
  return !isNaN(d.getTime());
}

/**
 * Valida se data de nascimento é válida (idade mínima 14 anos)
 */
export function validarDataNascimento(dataNascimento: string, idadeMinima: number = 14): boolean {
  const data = new Date(dataNascimento);
  if (isNaN(data.getTime())) return false;
  
  const hoje = new Date();
  const idade = hoje.getFullYear() - data.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = data.getMonth();
  
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < data.getDate())) {
    return idade - 1 >= idadeMinima;
  }
  return idade >= idadeMinima;
}

/**
 * Valida data de admissão (não pode ser futura)
 */
export function validarDataAdmissao(dataAdmissao: string): boolean {
  const data = new Date(dataAdmissao);
  if (isNaN(data.getTime())) return false;
  return data <= new Date();
}

// ============================================
// FORMATAÇÃO
// ============================================

/**
 * Formata CPF
 */
export function formatarCPF(cpf: string): string {
  const cpfLimpo = cpf.replace(/\D/g, '');
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CNPJ
 */
export function formatarCNPJ(cnpj: string): string {
  const cnpjLimpo = cnpj.replace(/\D/g, '');
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
  return telLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

/**
 * Formata CEP
 */
export function formatarCEP(cep: string): string {
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Formata PIS
 */
export function formatarPIS(pis: string): string {
  const pisLimpo = pis.replace(/\D/g, '');
  return pisLimpo.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4');
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

// ============================================
// VALIDAÇÃO DE VALORES
// ============================================

/**
 * Valida valor monetário positivo
 */
export function validarValorMonetario(valor: number): boolean {
  return typeof valor === 'number' && !isNaN(valor) && valor >= 0;
}

/**
 * Valida salário (deve ser >= salário mínimo)
 */
export function validarSalario(salario: number, salarioMinimo: number = 1518): boolean {
  return validarValorMonetario(salario) && salario >= salarioMinimo;
}

// ============================================
// EXPORTS AGRUPADOS
// ============================================

export const documentos = {
  validarCPF,
  validarCNPJ,
  validarPIS,
  formatarCPF,
  formatarCNPJ,
  formatarPIS,
  limparDocumento,
};

export const contato = {
  validarEmail,
  validarTelefone,
  validarCEP,
  formatarTelefone,
  formatarCEP,
  sanitizarEmail,
};

export const datas = {
  validarData,
  validarDataNascimento,
  validarDataAdmissao,
};

export const valores = {
  validarValorMonetario,
  validarSalario,
};
