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
