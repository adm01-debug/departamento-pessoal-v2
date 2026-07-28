/**
 * Column-header aliases accepted by the mass import flow.
 * Keys are normalized (lowercased, trimmed, diacritics stripped).
 */
export const COLUMN_MAP: Record<string, string> = {
  'nome': 'nome_completo', 'nome completo': 'nome_completo', 'nome_completo': 'nome_completo', 'colaborador': 'nome_completo',
  'cpf': 'cpf', 'cpf_cnpj': 'cpf',
  'email': 'email', 'e-mail': 'email', 'e_mail': 'email',
  'telefone': 'telefone', 'celular': 'telefone', 'fone': 'telefone', 'tel': 'telefone',
  'cargo': 'cargo', 'funcao': 'cargo', 'função': 'cargo',
  'departamento': 'departamento', 'depto': 'departamento', 'setor': 'departamento',
  'salario': 'salario_base', 'salário': 'salario_base', 'salario_base': 'salario_base', 'remuneracao': 'salario_base',
  'admissao': 'data_admissao', 'data_admissao': 'data_admissao', 'data admissão': 'data_admissao', 'data de admissão': 'data_admissao',
  'nascimento': 'data_nascimento', 'data_nascimento': 'data_nascimento', 'data nascimento': 'data_nascimento',
  'pis': 'pis', 'pis_pasep': 'pis', 'nit': 'pis',
  'rg': 'rg', 'identidade': 'rg',
};

export const TEMPLATE_HEADERS = [
  'Nome Completo', 'CPF', 'Email', 'Telefone', 'Cargo', 'Departamento',
  'Salário', 'Data Admissão', 'Data Nascimento', 'PIS', 'RG',
] as const;

export const TEMPLATE_SAMPLE_ROW = [
  'João Silva', '123.456.789-00', 'joao@email.com', '(11)99999-9999',
  'Analista', 'TI', '5000', '01/03/2024', '15/06/1990', '123.45678.90-1', '12.345.678-9',
] as const;

export function normalizeHeader(h: string): string {
  return String(h ?? '').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function mapColumns(headers: unknown[]): Record<number, string> {
  const map: Record<number, string> = {};
  headers.forEach((h, i) => {
    const n = normalizeHeader(String(h ?? ''));
    if (COLUMN_MAP[n]) map[i] = COLUMN_MAP[n];
  });
  return map;
}
