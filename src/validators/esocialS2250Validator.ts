// V17-E013: Validador eSocial S-2250 (Aviso Prévio)
export interface DadosS2250 { cpfTrab: string; matricula: string; dtAvPrv: string; tpAvPrv: number; dtPrevDeslig: string; }
export function validateS2250(dados: Partial<DadosS2250>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.matricula) errors.push('Matrícula obrigatória');
  if (!dados.dtAvPrv) errors.push('Data do aviso prévio obrigatória');
  if (dados.tpAvPrv === undefined) errors.push('Tipo de aviso prévio obrigatório');
  if (!dados.dtPrevDeslig) errors.push('Data prevista desligamento obrigatória');
  if (dados.tpAvPrv && ![1,2,3].includes(dados.tpAvPrv)) errors.push('Tipo aviso prévio inválido (1=Dado pelo empregador, 2=Dado pelo trabalhador, 3=Decorrente acordo)');
  return { valid: errors.length === 0, errors };
}
