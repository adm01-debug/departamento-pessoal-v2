// V17-E012: Validador eSocial S-2240 (Condições Ambientais)
export interface DadosS2240 { cpfTrab: string; matricula: string; dtIniCondicao: string; codAgNoc: string; dscAgNoc?: string; tpAval?: number; }
export function validateS2240(dados: Partial<DadosS2240>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.matricula) errors.push('Matrícula obrigatória');
  if (!dados.dtIniCondicao) errors.push('Data início condição obrigatória');
  if (!dados.codAgNoc) errors.push('Código agente nocivo obrigatório');
  return { valid: errors.length === 0, errors };
}
