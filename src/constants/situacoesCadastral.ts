// V14-065: situacoesCadastral.ts
export const situacoesCadastral = [
  { codigo: "01", descricao: "Nula" },
  { codigo: "02", descricao: "Ativa" },
  { codigo: "03", descricao: "Suspensa" },
  { codigo: "04", descricao: "Inapta" },
  { codigo: "08", descricao: "Baixada" },
] as const;

export type SituacaoCadastral = typeof situacoesCadastral[number];

export const getSituacaoByCodigo = (codigo: string) =>
  situacoesCadastral.find((s) => s.codigo === codigo);

export const situacaoOptions = situacoesCadastral.map((s) => ({
  value: s.codigo,
  label: s.descricao,
}));

