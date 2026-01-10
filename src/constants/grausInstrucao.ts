// V14-059: grausInstrucao.ts
export const grausInstrucao = [
  { codigo: "01", descricao: "Analfabeto" },
  { codigo: "02", descricao: "Até 5ª ano incompleto do Ensino Fundamental" },
  { codigo: "03", descricao: "5ª ano completo do Ensino Fundamental" },
  { codigo: "04", descricao: "6ª ao 9ª ano do Ensino Fundamental" },
  { codigo: "05", descricao: "Ensino Fundamental completo" },
  { codigo: "06", descricao: "Ensino Médio incompleto" },
  { codigo: "07", descricao: "Ensino Médio completo" },
  { codigo: "08", descricao: "Educação Superior incompleta" },
  { codigo: "09", descricao: "Educação Superior completa" },
  { codigo: "10", descricao: "Pós-Graduação completa" },
  { codigo: "11", descricao: "Mestrado completo" },
  { codigo: "12", descricao: "Doutorado completo" },
] as const;

export type GrauInstrucao = typeof grausInstrucao[number];

export const getGrauInstrucaoByCodigo = (codigo: string) =>
  grausInstrucao.find((g) => g.codigo === codigo);

export const grauInstrucaoOptions = grausInstrucao.map((g) => ({
  value: g.codigo,
  label: g.descricao,
}));

