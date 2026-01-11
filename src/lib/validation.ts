// V15-132: src/lib/validation.ts
export const rules = {
  required: (value: any) => value !== null && value !== undefined && value !== '' ? null : 'Campo obrigatório',
  
  minLength: (min: number) => (value: string) => 
    !value || value.length >= min ? null : `Mínimo ${min} caracteres`,
  
  maxLength: (max: number) => (value: string) => 
    !value || value.length <= max ? null : `Máximo ${max} caracteres`,
  
  email: (value: string) => 
    !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Email inválido',
  
  cpf: (value: string) => {
    if (!value) return null;
    const cpf = value.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)+$/.test(cpf)) return 'CPF inválido';
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let d1 = (sum * 10) % 11; if (d1 === 10) d1 = 0;
    if (d1 !== parseInt(cpf[9])) return 'CPF inválido';
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    let d2 = (sum * 10) % 11; if (d2 === 10) d2 = 0;
    return d2 === parseInt(cpf[10]) ? null : 'CPF inválido';
  },
  
  cnpj: (value: string) => {
    if (!value) return null;
    const cnpj = value.replace(/\D/g, '');
    if (cnpj.length !== 14) return 'CNPJ inválido';
    return null;
  },
  
  phone: (value: string) => {
    if (!value) return null;
    const phone = value.replace(/\D/g, '');
    return phone.length >= 10 && phone.length <= 11 ? null : 'Telefone inválido';
  },
  
  cep: (value: string) => {
    if (!value) return null;
    const cep = value.replace(/\D/g, '');
    return cep.length === 8 ? null : 'CEP inválido';
  },
  
  positive: (value: number) => !value || value > 0 ? null : 'Deve ser positivo',
  
  min: (minVal: number) => (value: number) => 
    !value || value >= minVal ? null : `Mínimo ${minVal}`,
  
  max: (maxVal: number) => (value: number) => 
    !value || value <= maxVal ? null : `Máximo ${maxVal}`,
  
  date: (value: string) => {
    if (!value) return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? 'Data inválida' : null;
  },
  
  futureDate: (value: string) => {
    if (!value) return null;
    return new Date(value) > new Date() ? null : 'Data deve ser futura';
  },
  
  pastDate: (value: string) => {
    if (!value) return null;
    return new Date(value) < new Date() ? null : 'Data deve ser passada';
  }
};

export function validate<T extends Record<string, any>>(
  data: T,
  schema: Record<keyof T, ((value: any) => string | null)[]>
): Record<keyof T, string | null> {
  const errors = {} as Record<keyof T, string | null>;
  for (const key in schema) {
    for (const rule of schema[key]) {
      const error = rule(data[key]);
      if (error) { errors[key] = error; break; }
      else errors[key] = null;
    }
  }
  return errors;
}
