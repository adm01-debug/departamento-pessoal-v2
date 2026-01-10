// V14-063: ncms.ts
// NCM - Nomenclatura Comum do Mercosul (exemplos principais)
export const ncms = [
  { codigo: "84713012", descricao: "Computadores portáteis" },
  { codigo: "84714900", descricao: "Outras máquinas automáticas processamento dados" },
  { codigo: "85171210", descricao: "Telefones celulares" },
  { codigo: "94013000", descricao: "Assentos giratórios de altura ajustável" },
  { codigo: "94017900", descricao: "Outros assentos com armação de metal" },
  { codigo: "94032000", descricao: "Outros móveis de metal" },
  { codigo: "94033000", descricao: "Móveis de madeira escritórios" },
  { codigo: "48191000", descricao: "Caixas de papel ou cartão ondulado" },
  { codigo: "48192000", descricao: "Caixas e cartonagens dobráveis" },
  { codigo: "39231000", descricao: "Caixas, engradados e artigos semelhantes" },
  { codigo: "64029900", descricao: "Outros calçados de borracha/plástico" },
  { codigo: "62034200", descricao: "Calças de algodão para homens" },
  { codigo: "61091000", descricao: "Camisetas de malha de algodão" },
] as const;

export type NCM = typeof ncms[number];

export const getNCMByCodigo = (codigo: string) =>
  ncms.find((n) => n.codigo === codigo);

export const ncmOptions = ncms.map((n) => ({
  value: n.codigo,
  label: `${n.codigo} - ${n.descricao}`,
}));

