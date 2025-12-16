// Mask utility functions for Brazilian document formats

export type MaskType = 'cpf' | 'cnpj' | 'cpfCnpj' | 'phone' | 'cep' | 'date' | 'currency' | 'rg';

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
};

export const unmask = (value: string): string => onlyDigits(value);

export const applyMask = (value: string, maskType: MaskType): string => {
  return masks[maskType](value);
};
