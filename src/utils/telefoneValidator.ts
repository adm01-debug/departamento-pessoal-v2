// V18: Validador de Telefone Brasileiro - Formatado e Documentado

/**
 * DDDs válidos no Brasil
 */
const DDDS_VALIDOS = [
  // Região Sudeste
  11, 12, 13, 14, 15, 16, 17, 18, 19, // SP
  21, 22, 24, // RJ
  27, 28, // ES
  31, 32, 33, 34, 35, 37, 38, // MG
  // Região Sul
  41, 42, 43, 44, 45, 46, // PR
  47, 48, 49, // SC
  51, 53, 54, 55, // RS
  // Região Centro-Oeste
  61, // DF
  62, 64, // GO
  63, // TO
  65, 66, // MT
  67, // MS
  // Região Nordeste
  71, 73, 74, 75, 77, // BA
  79, // SE
  81, 87, // PE
  82, // AL
  83, // PB
  84, // RN
  85, 88, // CE
  86, 89, // PI
  98, 99, // MA
  // Região Norte
  91, 93, 94, // PA
  92, 97, // AM
  95, // RR
  96, // AP
  68, // AC
  69, // RO
];

/**
 * Valida telefone brasileiro (fixo ou celular)
 * @param telefone - Número com ou sem máscara
 * @returns true se válido
 */
export function validateTelefone(telefone: string): boolean {
  if (!telefone) return false;
  
  const cleaned = telefone.replace(/\D/g, '');
  
  // Verifica tamanho (10 para fixo, 11 para celular)
  if (cleaned.length < 10 || cleaned.length > 11) {
    return false;
  }
  
  // Extrai DDD
  const ddd = parseInt(cleaned.substring(0, 2));
  if (!DDDS_VALIDOS.includes(ddd)) {
    return false;
  }
  
  // Verifica se celular começa com 9
  if (cleaned.length === 11) {
    const primeiroDigito = cleaned.charAt(2);
    if (primeiroDigito !== '9') {
      return false;
    }
  }
  
  return true;
}

/**
 * Verifica se é celular
 * @param telefone - Número do telefone
 * @returns true se for celular
 */
export function isCelular(telefone: string): boolean {
  const cleaned = telefone.replace(/\D/g, '');
  return cleaned.length === 11 && cleaned.charAt(2) === '9';
}

/**
 * Verifica se é fixo
 * @param telefone - Número do telefone
 * @returns true se for fixo
 */
export function isFixo(telefone: string): boolean {
  const cleaned = telefone.replace(/\D/g, '');
  return cleaned.length === 10;
}

/**
 * Formata telefone com máscara
 * @param telefone - Número do telefone
 * @returns Telefone formatado: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export function formatTelefone(telefone: string): string {
  const cleaned = telefone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    // Celular: (XX) XXXXX-XXXX
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return telefone;
}

/**
 * Remove máscara do telefone
 * @param telefone - Telefone com máscara
 * @returns Apenas dígitos
 */
export function cleanTelefone(telefone: string): string {
  return telefone.replace(/\D/g, '');
}

/**
 * Extrai DDD do telefone
 * @param telefone - Número do telefone
 * @returns DDD (2 dígitos)
 */
export function extractDDD(telefone: string): string {
  const cleaned = telefone.replace(/\D/g, '');
  return cleaned.substring(0, 2);
}

/**
 * Valida e retorna tipo do telefone
 * @param telefone - Número do telefone
 * @returns Objeto com validação e tipo
 */
export function validateAndClassify(telefone: string): { 
  valido: boolean; 
  tipo: 'celular' | 'fixo' | 'invalido';
  ddd: string;
  formatado: string;
} {
  const valido = validateTelefone(telefone);
  
  if (!valido) {
    return { valido: false, tipo: 'invalido', ddd: '', formatado: telefone };
  }
  
  return {
    valido: true,
    tipo: isCelular(telefone) ? 'celular' : 'fixo',
    ddd: extractDDD(telefone),
    formatado: formatTelefone(telefone)
  };
}

export default {
  validateTelefone,
  isCelular,
  isFixo,
  formatTelefone,
  cleanTelefone,
  extractDDD,
  validateAndClassify
};
