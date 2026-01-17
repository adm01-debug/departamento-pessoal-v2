// V18: Validador de CPF - Formatado e Documentado
// CPF: 11 dígitos com 2 dígitos verificadores (módulo 11)

/**
 * Valida CPF usando algoritmo módulo 11
 * @param cpf - Número do CPF com ou sem máscara
 * @returns true se válido, false se inválido
 */
export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleaned.length !== 11) {
    return false;
  }
  
  // Rejeita sequências repetidas (111.111.111-11, etc)
  if (/^(\d)\1{10}$/.test(cleaned)) {
    return false;
  }
  
  // Calcula primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cleaned[9])) {
    return false;
  }
  
  // Calcula segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  
  return rest === parseInt(cleaned[10]);
}

/**
 * Formata CPF com máscara
 * @param cpf - Número do CPF
 * @returns CPF formatado: XXX.XXX.XXX-XX
 */
export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
}

/**
 * Remove máscara do CPF
 */
export function cleanCPF(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

export default validateCPF;
