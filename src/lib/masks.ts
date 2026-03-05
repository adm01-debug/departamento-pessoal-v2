// V15-128: src/lib/masks.ts
export function maskCPF(value: string): string {
  return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').slice(0, 14);
}

export function maskCNPJ(value: string): string {
  return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})/, '$1-$2').slice(0, 18);
}

export function maskPhone(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 10) {
    return cleaned.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  }
  return cleaned.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 15);
}

export function maskCEP(value: string): string {
  return value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);
}

export function maskPIS(value: string): string {
  return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{5})(\d)/, '$1.$2').replace(/(\d{2})(\d{1})/, '$1-$2').slice(0, 14);
}

export function maskCurrency(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/\D/g, '')) / 100 : value;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function maskDate(value: string): string {
  return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 10);
}

export function unmask(value: string): string {
  return value.replace(/\D/g, '');
}

export function maskRG(value: string): string {
  return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1})/, '$1-$2').slice(0, 12);
}

export function maskCTPS(value: string): string {
  return value.replace(/\D/g, '').replace(/(\d{7})(\d)/, '$1/$2').slice(0, 12);
}

// Validators
export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned.charAt(i)) * (10 - i);
  let rest = 11 - (sum % 11);
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(cleaned.charAt(9))) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned.charAt(i)) * (11 - i);
  rest = 11 - (sum % 11);
  if (rest === 10 || rest === 11) rest = 0;
  return rest === parseInt(cleaned.charAt(10));
}

export function validatePIS(pis: string): boolean {
  const cleaned = pis.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned.charAt(i)) * weights[i];
  const rest = 11 - (sum % 11);
  const digit = rest === 10 || rest === 11 ? 0 : rest;
  return digit === parseInt(cleaned.charAt(10));
}

export function validateRG(rg: string): boolean {
  const cleaned = rg.replace(/\D/g, '');
  return cleaned.length >= 5 && cleaned.length <= 14;
}

export function getRGFormatInfo(): string {
  return 'Formato varia por estado. Geralmente 2 dígitos + 3 dígitos + 3 dígitos + 1 dígito verificador.';
}

export function validateTituloEleitor(titulo: string): boolean {
  const cleaned = titulo.replace(/\D/g, '');
  return cleaned.length === 12;
}

export function validateCNH(cnh: string): boolean {
  const cleaned = cnh.replace(/\D/g, '');
  return cleaned.length === 11;
}

export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14 || /^(\d)\1{13}$/.test(cleaned)) return false;
  let sum = 0;
  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 12; i++) sum += parseInt(cleaned.charAt(i)) * w1[i];
  let rest = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (rest !== parseInt(cleaned.charAt(12))) return false;
  sum = 0;
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  for (let i = 0; i < 13; i++) sum += parseInt(cleaned.charAt(i)) * w2[i];
  rest = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return rest === parseInt(cleaned.charAt(13));
}
