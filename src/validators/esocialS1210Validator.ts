// V17-E023: Validador eSocial S-1210 (Pagamentos)
export interface DadosS1210 { cpfTrab: string; perApur: string; dtPgto: string; tpPgto: number; vrLiq: number; }
export function validateS1210(dados: Partial<DadosS1210>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.cpfTrab) errors.push('CPF do trabalhador obrigatório');
  if (!dados.perApur) errors.push('Período de apuração obrigatório');
  if (!dados.dtPgto) errors.push('Data do pagamento obrigatória');
  if (dados.tpPgto === undefined) errors.push('Tipo de pagamento obrigatório');
  if (dados.vrLiq === undefined) errors.push('Valor líquido obrigatório');
  return { valid: errors.length === 0, errors };
}
