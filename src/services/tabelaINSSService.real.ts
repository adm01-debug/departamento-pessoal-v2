// V17-S102: TabelaINSSService Real
export const TABELA_INSS_2025 = [
  { ate: 1518.00, aliquota: 7.5 },
  { ate: 2793.88, aliquota: 9 },
  { ate: 4190.83, aliquota: 12 },
  { ate: 8157.41, aliquota: 14 }
];
export const tabelaINSSServiceReal = {
  getTabela(ano: number = 2025) { return TABELA_INSS_2025; },
  getTeto(ano: number = 2025) { return 8157.41; }
}; export default tabelaINSSServiceReal;
