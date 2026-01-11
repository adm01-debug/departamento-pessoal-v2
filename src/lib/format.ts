// V15-099: src/lib/format.ts

export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '').slice(0, 11);
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '').slice(0, 14);
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

export function formatCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, '').slice(0, 8);
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
}

export function formatCurrency(value: number, locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: Date | string, format = 'dd/MM/yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return format.replace('dd', day).replace('MM', month).replace('yyyy', year.toString());
}

export function formatPIS(pis: string): string {
  const cleaned = pis.replace(/\D/g, '').slice(0, 11);
  return cleaned.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4');
}
