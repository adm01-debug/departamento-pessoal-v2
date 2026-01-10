// V14-064: racasCores.ts
export const racasCores = [
  { codigo: 1, descricao: "Branca" },
  { codigo: 2, descricao: "Preta" },
  { codigo: 3, descricao: "Parda" },
  { codigo: 4, descricao: "Amarela" },
  { codigo: 5, descricao: "Indígena" },
  { codigo: 6, descricao: "Não Informado" },
] as const;

export type RacaCor = typeof racasCores[number];
export type RacaCorCodigo = RacaCor["codigo"];

export const getRacaCorByCodigo = (codigo: number) =>
  racasCores.find((r) => r.codigo === codigo);

export const racaCorOptions = racasCores.map((r) => ({
  value: String(r.codigo),
  label: r.descricao,
}));

