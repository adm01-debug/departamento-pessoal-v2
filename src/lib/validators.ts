// V15-089: src/lib/validators.ts
import { z } from 'zod';

export const cpfValidator = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  if (/^(\d)+$/.test(cleaned)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== parseInt(cleaned[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  return digit === parseInt(cleaned[10]);
};

export const cnpjValidator = (cnpj: string): boolean => {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return false;
  if (/^(\d)+$/.test(cleaned)) return false;
  const weights1 = [5,4,3,2,9,8,7,6,5,4,3,2];
  const weights2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += parseInt(cleaned[i]) * weights1[i];
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== parseInt(cleaned[12])) return false;
  sum = 0;
  for (let i = 0; i < 13; i++) sum += parseInt(cleaned[i]) * weights2[i];
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return digit === parseInt(cleaned[13]);
};

export const emailValidator = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

export const phoneValidator = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};

export const cepValidator = (cep: string): boolean => {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.length === 8;
};

export const pisValidator = (pis: string): boolean => {
  const cleaned = pis.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  const weights = [3,2,9,8,7,6,5,4,3,2];
  let sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * weights[i];
  const digit = 11 - (sum % 11);
  return (digit > 9 ? 0 : digit) === parseInt(cleaned[10]);
};
