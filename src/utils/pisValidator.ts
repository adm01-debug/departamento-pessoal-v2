// V18: Validador de PIS/PASEP/NIT - Formatado e Documentado
// PIS: 11 dígitos com dígito verificador

/**
 * Valida PIS/PASEP/NIT
 * @param pis - Número do PIS com ou sem máscara
 * @returns true se válido, false se inválido
 */
export function validatePIS(pis: string): boolean {
  // Remove caracteres não numéricos
  const cleaned = pis.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleaned.length !== 11) {
    return false;
  }
  
  // Rejeita sequências repetidas
  if (/^(\d)\1{10}$/.test(cleaned)) {
    return false;
  }
  
  // Multiplicadores oficiais do PIS
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  // Calcula soma ponderada
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * weights[i];
  }
  
  // Calcula dígito verificador
  const rest = sum % 11;
  const digit = rest < 2 ? 0 : 11 - rest;
  
  // Compara com o dígito informado
  return digit === parseInt(cleaned[10]);
}

/**
 * Formata PIS com máscara
 * @param pis - Número do PIS
 * @returns PIS formatado: XXX.XXXXX.XX-X
 */
export function formatPIS(pis: string): string {
  const cleaned = pis.replace(/\D/g, '');
  if (cleaned.length !== 11) return pis;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 8)}.${cleaned.slice(8, 10)}-${cleaned.slice(10)}`;
}

/**
 * Remove máscara do PIS
 */
export function cleanPIS(pis: string): string {
  return pis.replace(/\D/g, '');
}

export default validatePIS;
