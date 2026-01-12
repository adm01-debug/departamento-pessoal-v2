// V17-E028: Validador eSocial S-1299 (Fechamento)
export interface DadosS1299 { perApur: string; evtRemun: string; evtPgtos: string; evtAqProd?: string; evtContratAvNP?: string; evtInfoComplPer?: string; }
export function validateS1299(dados: Partial<DadosS1299>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!dados.perApur) errors.push('Período de apuração obrigatório');
  if (!dados.evtRemun) errors.push('Indicador eventos remuneração obrigatório');
  if (!dados.evtPgtos) errors.push('Indicador eventos pagamentos obrigatório');
  return { valid: errors.length === 0, errors };
}
