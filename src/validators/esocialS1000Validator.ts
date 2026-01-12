// V17-E001: Validador eSocial S-1000 (Empregador/Contribuinte)
export interface DadosS1000 {
  tpInsc: number; nrInsc: string; nmRazao: string; classTrib: string;
  natJurid?: string; indCoop?: number; indConstr?: number; indDesFolha: number;
  indOptRegEletron: number; cnpjEFR?: string; nmCtt: string; cpfCtt: string;
  foneFixo?: string; foneCel?: string; email?: string;
}
export function validateS1000(dados: Partial<DadosS1000>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.tpInsc) errors.push('Tipo de inscrição obrigatório');
  if (!dados.nrInsc) errors.push('Número de inscrição obrigatório');
  if (!dados.nmRazao) errors.push('Razão social obrigatória');
  if (!dados.classTrib) errors.push('Classificação tributária obrigatória');
  if (!dados.nmCtt) errors.push('Nome do contato obrigatório');
  if (!dados.cpfCtt) errors.push('CPF do contato obrigatório');
  if (dados.tpInsc === 1 && dados.nrInsc?.length !== 14) errors.push('CNPJ deve ter 14 dígitos');
  if (dados.tpInsc === 2 && dados.nrInsc?.length !== 11) errors.push('CPF deve ter 11 dígitos');
  if (dados.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) errors.push('Email inválido');
  return { valid: errors.length === 0, errors };
}
export default validateS1000;
