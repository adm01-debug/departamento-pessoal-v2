// V17-S104: TabelaSalarioFamiliaService Real
export const TABELA_SF_2025 = { limite: 1819.26, valor: 62.04 };
export const tabelaSalarioFamiliaServiceReal = {
  getTabela(ano: number = 2025) { return TABELA_SF_2025; },
  temDireito(salario: number) { return salario <= TABELA_SF_2025.limite; },
  getValorCota() { return TABELA_SF_2025.valor; }
}; export default tabelaSalarioFamiliaServiceReal;
