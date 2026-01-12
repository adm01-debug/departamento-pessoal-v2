// V17-E008: Validador eSocial S-2206 (Alteração Contratual)
export interface DadosS2206 { cpfTrab: string; matricula: string; dtAlteracao: string; vrSalFx?: number; undSalFixo?: number; tpContr?: number; dtTerm?: string; }
export function validateS2206(dados: Partial<DadosS2206>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.matricula) errors.push('Matrícula obrigatória');
  if (!dados.dtAlteracao) errors.push('Data da alteração obrigatória');
  if (dados.vrSalFx !== undefined && dados.vrSalFx <= 0) errors.push('Valor do salário deve ser maior que zero');
  return { valid: errors.length === 0, errors };
}
