// V14-066: tabelasSalarioFamilia.ts
// Tabela de Salário Família 2024
export const tabelasSalarioFamilia = [
  {
    vigencia: "2024-01-01",
    faixas: [
      { limiteSalarial: 1819.26, valorCota: 62.04 },
    ],
  },
  {
    vigencia: "2023-01-01",
    faixas: [
      { limiteSalarial: 1754.18, valorCota: 59.82 },
    ],
  },
  {
    vigencia: "2022-01-01",
    faixas: [
      { limiteSalarial: 1655.98, valorCota: 56.47 },
    ],
  },
] as const;

export type TabelaSalarioFamilia = typeof tabelasSalarioFamilia[number];

export const getTabelaVigente = (data: Date = new Date()) => {
  const dataStr = data.toISOString().split("T")[0];
  return tabelasSalarioFamilia.find((t) => t.vigencia <= dataStr) || tabelasSalarioFamilia[0];
};

export const calcularSalarioFamilia = (salario: number, dependentes: number, data?: Date) => {
  const tabela = getTabelaVigente(data);
  const faixa = tabela.faixas.find((f) => salario <= f.limiteSalarial);
  if (!faixa) return 0;
  return faixa.valorCota * dependentes;
};

