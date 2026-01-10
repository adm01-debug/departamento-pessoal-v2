// V14-070: tiposLogradouro.ts
export const tiposLogradouro = [
  { codigo: "R", descricao: "Rua" },
  { codigo: "AV", descricao: "Avenida" },
  { codigo: "AL", descricao: "Alameda" },
  { codigo: "BC", descricao: "Beco" },
  { codigo: "BL", descricao: "Bloco" },
  { codigo: "EST", descricao: "Estrada" },
  { codigo: "GAL", descricao: "Galeria" },
  { codigo: "LG", descricao: "Largo" },
  { codigo: "LD", descricao: "Ladeira" },
  { codigo: "PC", descricao: "Praça" },
  { codigo: "PQ", descricao: "Parque" },
  { codigo: "PAS", descricao: "Passagem" },
  { codigo: "ROD", descricao: "Rodovia" },
  { codigo: "TR", descricao: "Travessa" },
  { codigo: "VL", descricao: "Vila" },
  { codigo: "VD", descricao: "Viaduto" },
] as const;

export type TipoLogradouro = typeof tiposLogradouro[number];

export const getTipoLogradouroByCodigo = (codigo: string) =>
  tiposLogradouro.find((t) => t.codigo === codigo);

export const tipoLogradouroOptions = tiposLogradouro.map((t) => ({
  value: t.codigo,
  label: t.descricao,
}));

