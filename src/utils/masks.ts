export function maskCPF(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

export function maskCNPJ(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
}

export function maskPhone(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
}

export function maskCEP(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
}

export function maskMoney(value: string): string {
  const num = value.replace(/\D/g, '');
  const formatted = (parseInt(num || '0') / 100).toFixed(2);
  return formatted.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function maskPIS(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{5})(\d)/, '$1.$2')
    .replace(/(\d{2})(\d)/, '$1-$2')
    .replace(/(-\d{1})\d+?$/, '$1');
}

export function maskDate(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})\d+?$/, '$1');
}

export function maskTime(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1:$2')
    .replace(/(:\d{2})\d+?$/, '$1');
}

export function unmask(value: string): string {
  return value.replace(/\D/g, '');
}

// Object with all masks for MaskedInput component
export const masks = {
  cpf: maskCPF,
  cnpj: maskCNPJ,
  telefone: maskPhone,
  cep: maskCEP,
  moeda: maskMoney,
  data: maskDate,
  hora: maskTime,
  pis: maskPIS,
};

export default masks;
