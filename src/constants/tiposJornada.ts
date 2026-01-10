// V14-069: tiposJornada.ts
export const tiposJornada = [
  { codigo: "1", descricao: "Jornada com horário diário fixo e folga fixa" },
  { codigo: "2", descricao: "Jornada 12x36 (12 horas de trabalho por 36 de descanso)" },
  { codigo: "3", descricao: "Jornada com horário diário fixo e folga em escala" },
  { codigo: "4", descricao: "Jornada com horário diário em escala e folga fixa" },
  { codigo: "5", descricao: "Jornada com horário diário em escala e folga em escala" },
  { codigo: "6", descricao: "Jornada com horário noturno e folga fixa" },
  { codigo: "7", descricao: "Jornada com horário noturno e folga em escala" },
  { codigo: "9", descricao: "Demais tipos de jornada" },
] as const;

export type TipoJornada = typeof tiposJornada[number];

export const getTipoJornadaByCodigo = (codigo: string) =>
  tiposJornada.find((t) => t.codigo === codigo);

export const tipoJornadaOptions = tiposJornada.map((t) => ({
  value: t.codigo,
  label: t.descricao,
}));

