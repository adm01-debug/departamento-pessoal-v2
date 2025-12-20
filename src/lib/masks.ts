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
    const digits = onlyDigits(value).slice(0, 9);
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}-${digits.slice(8)}`;
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
