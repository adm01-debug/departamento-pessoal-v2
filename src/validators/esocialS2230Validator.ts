// V17-E011: Validador eSocial S-2230 (Afastamento Temporário)
export interface DadosS2230 { cpfTrab: string; matricula: string; dtIniAfast: string; codMotAfast: string; dtFimAfast?: string; }
export function validateS2230(dados: Partial<DadosS2230>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.matricula) errors.push('Matrícula obrigatória');
  if (!dados.dtIniAfast) errors.push('Data início afastamento obrigatória');
  if (!dados.codMotAfast) errors.push('Código motivo afastamento obrigatório');
  if (dados.dtFimAfast && dados.dtIniAfast && new Date(dados.dtFimAfast) < new Date(dados.dtIniAfast)) errors.push('Data fim não pode ser anterior à data início');
  return { valid: errors.length === 0, errors };
}
