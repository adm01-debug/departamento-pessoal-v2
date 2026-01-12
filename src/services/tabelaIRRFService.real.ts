// V17-S103: TabelaIRRFService Real
export const TABELA_IRRF_2025 = [
  { ate: 2259.20, aliquota: 0, deducao: 0 },
  { ate: 2826.65, aliquota: 7.5, deducao: 169.44 },
  { ate: 3751.05, aliquota: 15, deducao: 381.44 },
  { ate: 4664.68, aliquota: 22.5, deducao: 662.77 },
  { ate: Infinity, aliquota: 27.5, deducao: 896.00 }
];
export const tabelaIRRFServiceReal = {
  getTabela(ano: number = 2025) { return TABELA_IRRF_2025; },
  getDeducaoDependente(ano: number = 2025) { return 189.59; }
}; export default tabelaIRRFServiceReal;
