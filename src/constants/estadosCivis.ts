// V14-058: estadosCivis.ts
export const estadosCivis = [
  { codigo: 1, descricao: "Solteiro(a)" },
  { codigo: 2, descricao: "Casado(a)" },
  { codigo: 3, descricao: "Divorciado(a)" },
  { codigo: 4, descricao: "Separado(a) Judicialmente" },
  { codigo: 5, descricao: "Viúvo(a)" },
  { codigo: 6, descricao: "União Estável" },
  { codigo: 9, descricao: "Outros" },
] as const;

export type EstadoCivil = typeof estadosCivis[number];
export type EstadoCivilCodigo = EstadoCivil["codigo"];

export const getEstadoCivilByCodigo = (codigo: number) =>
  estadosCivis.find((e) => e.codigo === codigo);

export const estadoCivilOptions = estadosCivis.map((e) => ({
  value: String(e.codigo),
  label: e.descricao,
}));

