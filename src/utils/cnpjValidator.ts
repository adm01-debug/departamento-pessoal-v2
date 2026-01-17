// V18: Validador de CNPJ - Formatado e Documentado
// CNPJ: 14 dígitos com 2 dígitos verificadores (módulo 11)

/**
 * Valida CNPJ usando algoritmo módulo 11
 * @param cnpj - Número do CNPJ com ou sem máscara
 * @returns true se válido, false se inválido
 */
export function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cleaned = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (cleaned.length !== 14) {
    return false;
  }
  
  // Rejeita sequências repetidas
  if (/^(\d)\1{13}$/.test(cleaned)) {
    return false;
  }
  
  // Função para calcular dígito verificador
  const calcDigit = (position: number): number => {
    let sum = 0;
    let weight = position - 7;
    
    for (let i = position; i >= 1; i--) {
      sum += parseInt(cleaned[position - i]) * weight--;
      if (weight < 2) weight = 9;
    }
    
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  
  // Valida primeiro dígito verificador (posição 12)
  if (calcDigit(12) !== parseInt(cleaned[12])) {
    return false;
  }
  
  // Valida segundo dígito verificador (posição 13)
  return calcDigit(13) === parseInt(cleaned[13]);
}

/**
 * Formata CNPJ com máscara
 * @param cnpj - Número do CNPJ
 * @returns CNPJ formatado: XX.XXX.XXX/XXXX-XX
 */
export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return cnpj;
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
}

/**
 * Remove máscara do CNPJ
 */
export function cleanCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

export default validateCNPJ;
