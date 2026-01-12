// V17-E024: Validador eSocial S-1260 (Comercialização Produção Rural)
export interface DadosS1260 { perApur: string; tpInscAdq: number; nrInscAdq: string; vrTotCom: number; }
export function validateS1260(dados: Partial<DadosS1260>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.perApur) errors.push('Período de apuração obrigatório');
  if (dados.tpInscAdq === undefined) errors.push('Tipo inscrição adquirente obrigatório');
  if (!dados.nrInscAdq) errors.push('Número inscrição adquirente obrigatório');
  if (dados.vrTotCom === undefined) errors.push('Valor total comercialização obrigatório');
  return { valid: errors.length === 0, errors };
}
