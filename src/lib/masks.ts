// Mask utility functions for Brazilian document formats

export type MaskType = 'cpf' | 'cnpj' | 'cpfCnpj' | 'phone' | 'cep' | 'date' | 'currency' | 'rg' | 'pis';

const onlyDigits = (value: string): string => value.replace(/\D/g, '');

export const masks = {
  cpf: (value: string): string => {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  },

  cnpj: (value: string): string => {
    const digits = onlyDigits(value).slice(0, 14);
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  },

  cpfCnpj: (value: string): string => {
    const digits = onlyDigits(value);
    if (digits.length <= 11) return masks.cpf(value);
    return masks.cnpj(value);
  },

  phone: (value: string): string => {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  },

  cep: (value: string): string => {
    const digits = onlyDigits(value).slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  },

  date: (value: string): string => {
    const digits = onlyDigits(value).slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  },

  currency: (value: string): string => {
    const digits = onlyDigits(value);
    if (digits.length === 0) return '';
    const numValue = parseInt(digits, 10) / 100;
    return numValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  },

  rg: (value: string): string => {
    // Formato genérico: permite letras no final (ex: SP usa X como dígito)
    const cleaned = value.replace(/[^0-9Xx]/g, '').slice(0, 9).toUpperCase();
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}-${cleaned.slice(8)}`;
  },

  pis: (value: string): string => {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 8) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 10) return `${digits.slice(0, 3)}.${digits.slice(3, 8)}.${digits.slice(8)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 8)}.${digits.slice(8, 10)}-${digits.slice(10)}`;
  },
};

export const placeholders: Record<MaskType, string> = {
  cpf: '000.000.000-00',
  cnpj: '00.000.000/0000-00',
  cpfCnpj: '000.000.000-00 ou 00.000.000/0000-00',
  phone: '(00) 00000-0000',
  cep: '00000-000',
  date: 'DD/MM/AAAA',
  currency: 'R$ 0,00',
  rg: '00.000.000-0',
  pis: '000.00000.00-0',
};

export const unmask = (value: string): string => onlyDigits(value);

export const applyMask = (value: string, maskType: MaskType): string => {
  return masks[maskType](value);
};

// CPF Validation with check digit verification
export const validateCPF = (cpf: string): boolean => {
  const digits = onlyDigits(cpf);
  
  if (digits.length !== 11) return false;
  
  // Check for known invalid patterns (all same digits)
  if (/^(\d)\1{10}$/.test(digits)) return false;
  
  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;
  
  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;
  
  return true;
};

// CNPJ Validation with check digit verification
export const validateCNPJ = (cnpj: string): boolean => {
  const digits = onlyDigits(cnpj);
  
  if (digits.length !== 14) return false;
  
  // Check for known invalid patterns (all same digits)
  if (/^(\d)\1{13}$/.test(digits)) return false;
  
  // Validate first check digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(digits[12])) return false;
  
  // Validate second check digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i]) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(digits[13])) return false;
  
  return true;
};

// PIS/PASEP Validation with check digit verification
export const validatePIS = (pis: string): boolean => {
  const digits = onlyDigits(pis);
  
  if (digits.length !== 11) return false;
  
  // Check for known invalid patterns (all same digits)
  if (/^(\d)\1{10}$/.test(digits)) return false;
  
  // PIS/PASEP validation weights
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * weights[i];
  }
  
  const remainder = sum % 11;
  const checkDigit = remainder < 2 ? 0 : 11 - remainder;
  
  return checkDigit === parseInt(digits[10]);
};

// Validate CPF or CNPJ based on length
export const validateCPFCNPJ = (value: string): { valid: boolean; type: 'cpf' | 'cnpj' | null } => {
  const digits = onlyDigits(value);
  
  if (digits.length === 11) {
    return { valid: validateCPF(value), type: 'cpf' };
  }
  
  if (digits.length === 14) {
    return { valid: validateCNPJ(value), type: 'cnpj' };
  }
  
  return { valid: false, type: null };
};

// RG validation configuration by state
export const rgFormatsByState: Record<string, { 
  pattern: RegExp; 
  length: { min: number; max: number };
  description: string;
  example: string;
}> = {
  SP: { pattern: /^[0-9]{8,9}[0-9X]?$/, length: { min: 8, max: 10 }, description: '8-9 dígitos, pode terminar com X', example: '12.345.678-9' },
  RJ: { pattern: /^[0-9]{8,9}$/, length: { min: 8, max: 9 }, description: '8-9 dígitos', example: '12.345.678-9' },
  MG: { pattern: /^[A-Z]{2}[0-9]{6,7}$/, length: { min: 8, max: 9 }, description: '2 letras + 6-7 dígitos', example: 'MG-12.345.678' },
  RS: { pattern: /^[0-9]{9,10}$/, length: { min: 9, max: 10 }, description: '9-10 dígitos', example: '1234567890' },
  PR: { pattern: /^[0-9]{9,10}$/, length: { min: 9, max: 10 }, description: '9-10 dígitos', example: '12.345.678-9' },
  SC: { pattern: /^[0-9]{7,9}$/, length: { min: 7, max: 9 }, description: '7-9 dígitos', example: '1234567' },
  BA: { pattern: /^[0-9]{8,9}$/, length: { min: 8, max: 9 }, description: '8-9 dígitos', example: '12345678-90' },
  PE: { pattern: /^[0-9]{7,9}$/, length: { min: 7, max: 9 }, description: '7-9 dígitos', example: '1234567' },
  CE: { pattern: /^[0-9]{8,9}$/, length: { min: 8, max: 9 }, description: '8-9 dígitos', example: '12345678901' },
  GO: { pattern: /^[0-9]{9}$/, length: { min: 9, max: 9 }, description: '9 dígitos', example: '123456789' },
  DF: { pattern: /^[0-9]{7}$/, length: { min: 7, max: 7 }, description: '7 dígitos', example: '1234567' },
  ES: { pattern: /^[0-9]{7,9}$/, length: { min: 7, max: 9 }, description: '7-9 dígitos', example: '1234567' },
  PA: { pattern: /^[0-9]{7,8}$/, length: { min: 7, max: 8 }, description: '7-8 dígitos', example: '12345678' },
  AM: { pattern: /^[0-9]{8,9}$/, length: { min: 8, max: 9 }, description: '8-9 dígitos', example: '12345678' },
  MT: { pattern: /^[0-9]{8,9}$/, length: { min: 8, max: 9 }, description: '8-9 dígitos', example: '12345678' },
  MS: { pattern: /^[0-9]{8,9}$/, length: { min: 8, max: 9 }, description: '8-9 dígitos', example: '12345678' },
  MA: { pattern: /^[0-9]{9}$/, length: { min: 9, max: 9 }, description: '9 dígitos', example: '123456789' },
  PI: { pattern: /^[0-9]{7,9}$/, length: { min: 7, max: 9 }, description: '7-9 dígitos', example: '1234567' },
  RN: { pattern: /^[0-9]{9}$/, length: { min: 9, max: 9 }, description: '9 dígitos', example: '123456789' },
  PB: { pattern: /^[0-9]{8,9}$/, length: { min: 8, max: 9 }, description: '8-9 dígitos', example: '12345678' },
  AL: { pattern: /^[0-9]{7,9}$/, length: { min: 7, max: 9 }, description: '7-9 dígitos', example: '1234567' },
  SE: { pattern: /^[0-9]{8,9}$/, length: { min: 8, max: 9 }, description: '8-9 dígitos', example: '12345678' },
  RO: { pattern: /^[0-9]{7,8}$/, length: { min: 7, max: 8 }, description: '7-8 dígitos', example: '1234567' },
  AC: { pattern: /^[0-9]{7,8}$/, length: { min: 7, max: 8 }, description: '7-8 dígitos', example: '1234567' },
  AP: { pattern: /^[0-9]{7,9}$/, length: { min: 7, max: 9 }, description: '7-9 dígitos', example: '1234567' },
  RR: { pattern: /^[0-9]{7,8}$/, length: { min: 7, max: 8 }, description: '7-8 dígitos', example: '1234567' },
  TO: { pattern: /^[0-9]{7,9}$/, length: { min: 7, max: 9 }, description: '7-9 dígitos', example: '1234567' },
};

// Validate RG based on state
export const validateRG = (rg: string, uf?: string): { valid: boolean; message?: string } => {
  if (!rg) return { valid: true }; // RG is optional
  
  // Remove formatting, keep letters (for MG and X digit in SP)
  const cleaned = rg.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
  
  if (cleaned.length < 5) {
    return { valid: false, message: 'RG deve ter pelo menos 5 caracteres' };
  }
  
  if (cleaned.length > 14) {
    return { valid: false, message: 'RG deve ter no máximo 14 caracteres' };
  }
  
  // If state is provided, validate against state-specific rules
  if (uf && rgFormatsByState[uf]) {
    const stateFormat = rgFormatsByState[uf];
    const digitsAndLetters = cleaned;
    
    if (digitsAndLetters.length < stateFormat.length.min || digitsAndLetters.length > stateFormat.length.max) {
      return { 
        valid: false, 
        message: `RG de ${uf} deve ter ${stateFormat.length.min === stateFormat.length.max ? stateFormat.length.min : `${stateFormat.length.min}-${stateFormat.length.max}`} caracteres` 
      };
    }
  }
  
  return { valid: true };
};

// Get RG format info for a state
export const getRGFormatInfo = (uf: string): string => {
  const format = rgFormatsByState[uf];
  if (format) {
    return `${format.description} (ex: ${format.example})`;
  }
  return 'Formato padrão: 7-9 dígitos';
};
