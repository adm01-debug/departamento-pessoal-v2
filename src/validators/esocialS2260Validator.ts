// V17-E014: Validador eSocial S-2260 (Convocação Intermitente)
export interface DadosS2260 { cpfTrab: string; matricula: string; codConv: string; dtInicio: string; dtFim: string; dtPrevPgto: string; }
export function validateS2260(dados: Partial<DadosS2260>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.matricula) errors.push('Matrícula obrigatória');
  if (!dados.codConv) errors.push('Código da convocação obrigatório');
  if (!dados.dtInicio) errors.push('Data início obrigatória');
  if (!dados.dtFim) errors.push('Data fim obrigatória');
  if (!dados.dtPrevPgto) errors.push('Data prevista pagamento obrigatória');
  return { valid: errors.length === 0, errors };
}
