// V14-068: tiposDeficiencia.ts
export const tiposDeficiencia = [
  { codigo: "1", descricao: "Física" },
  { codigo: "2", descricao: "Auditiva" },
  { codigo: "3", descricao: "Visual" },
  { codigo: "4", descricao: "Mental/Intelectual" },
  { codigo: "5", descricao: "Múltipla" },
  { codigo: "6", descricao: "Reabilitado" },
] as const;

export type TipoDeficiencia = typeof tiposDeficiencia[number];

export const getTipoDeficienciaByCodigo = (codigo: string) =>
  tiposDeficiencia.find((t) => t.codigo === codigo);

export const tipoDeficienciaOptions = tiposDeficiencia.map((t) => ({
  value: t.codigo,
  label: t.descricao,
}));

