export interface TabelaIRRF { ano: number; faixas: { de: number; ate: number; aliquota: number; deducao: number }[]; deducaoDependente: number; }
const TABELAS_IRRF: Record<number, TabelaIRRF> = {
  2024: { ano: 2024, faixas: [{ de: 0, ate: 2259.20, aliquota: 0, deducao: 0 }, { de: 2259.21, ate: 2826.65, aliquota: 7.5, deducao: 169.44 }, { de: 2826.66, ate: 3751.05, aliquota: 15, deducao: 381.44 }, { de: 3751.06, ate: 4664.68, aliquota: 22.5, deducao: 662.77 }, { de: 4664.69, ate: 999999999, aliquota: 27.5, deducao: 896.00 }], deducaoDependente: 189.59 },
  2025: { ano: 2025, faixas: [{ de: 0, ate: 2428.80, aliquota: 0, deducao: 0 }, { de: 2428.81, ate: 3038.70, aliquota: 7.5, deducao: 182.16 }, { de: 3038.71, ate: 4032.32, aliquota: 15, deducao: 410.17 }, { de: 4032.33, ate: 5014.60, aliquota: 22.5, deducao: 712.60 }, { de: 5014.61, ate: 999999999, aliquota: 27.5, deducao: 963.33 }], deducaoDependente: 203.82 },
  2026: { ano: 2026, faixas: [{ de: 0, ate: 2550.24, aliquota: 0, deducao: 0 }, { de: 2550.25, ate: 3190.64, aliquota: 7.5, deducao: 191.27 }, { de: 3190.65, ate: 4233.94, aliquota: 15, deducao: 430.68 }, { de: 4233.95, ate: 5265.33, aliquota: 22.5, deducao: 748.23 }, { de: 5265.34, ate: 999999999, aliquota: 27.5, deducao: 1011.50 }], deducaoDependente: 214.01 },
};
export interface IRRFInput { salarioBruto: number; inss: number; dependentes: number; pensaoAlimenticia?: number; outrasDeduccoes?: number; ano?: number; }
export interface IRRFResult { baseCalculo: number; faixa: string; aliquota: number; deducaoFaixa: number; valorIRRF: number; deducoes: { tipo: string; valor: number }[]; }
export function calcularIRRF(input: IRRFInput): IRRFResult {
  const { salarioBruto, inss, dependentes, pensaoAlimenticia = 0, outrasDeduccoes = 0, ano = new Date().getFullYear() } = input;
  const tabela = TABELAS_IRRF[ano] || TABELAS_IRRF[2026];
  const deducaoDependentes = dependentes * tabela.deducaoDependente;
  const totalDeducoes = inss + deducaoDependentes + pensaoAlimenticia + outrasDeduccoes;
  const baseCalculo = Math.max(0, salarioBruto - totalDeducoes);
  const faixa = tabela.faixas.find(f => baseCalculo >= f.de && baseCalculo <= f.ate) || tabela.faixas[0];
  const valorBruto = baseCalculo * (faixa.aliquota / 100);
  const valorIRRF = Math.max(0, Number((valorBruto - faixa.deducao).toFixed(2)));
  return {
    baseCalculo: Number(baseCalculo.toFixed(2)), faixa: `${faixa.aliquota}%`, aliquota: faixa.aliquota, deducaoFaixa: faixa.deducao, valorIRRF,
    deducoes: [{ tipo: "INSS", valor: inss }, { tipo: "Dependentes", valor: deducaoDependentes }, { tipo: "Pensão", valor: pensaoAlimenticia }, { tipo: "Outras", valor: outrasDeduccoes }],
  };
}
export default { calcularIRRF, TABELAS_IRRF };
