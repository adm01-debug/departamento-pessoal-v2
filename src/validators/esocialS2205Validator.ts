// V17-E007: Validador eSocial S-2205 (Alteração Cadastral)
export interface DadosS2205 { cpfTrab: string; dtAlteracao: string; nmTrab?: string; sexo?: string; racaCor?: number; estCiv?: number; grauInstr?: string; nmSoc?: string; }
export function validateS2205(dados: Partial<DadosS2205>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.dtAlteracao) errors.push('Data da alteração obrigatória');
  if (dados.sexo && !['M', 'F'].includes(dados.sexo)) errors.push('Sexo deve ser M ou F');
  if (dados.racaCor !== undefined && ![1,2,3,4,5,6].includes(dados.racaCor)) errors.push('Raça/Cor inválida');
  return { valid: errors.length === 0, errors };
}
