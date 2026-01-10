// V14-062: nacionalidades.ts
export const nacionalidades = [
  { codigo: "10", descricao: "Brasileiro" },
  { codigo: "20", descricao: "Naturalizado Brasileiro" },
  { codigo: "21", descricao: "Argentino" },
  { codigo: "22", descricao: "Boliviano" },
  { codigo: "23", descricao: "Chileno" },
  { codigo: "24", descricao: "Paraguaio" },
  { codigo: "25", descricao: "Uruguaio" },
  { codigo: "26", descricao: "Venezuelano" },
  { codigo: "27", descricao: "Colombiano" },
  { codigo: "28", descricao: "Peruano" },
  { codigo: "29", descricao: "Equatoriano" },
  { codigo: "30", descricao: "Alemão" },
  { codigo: "31", descricao: "Belga" },
  { codigo: "32", descricao: "Britânico" },
  { codigo: "33", descricao: "Canadense" },
  { codigo: "34", descricao: "Espanhol" },
  { codigo: "35", descricao: "Norte-Americano (EUA)" },
  { codigo: "36", descricao: "Francês" },
  { codigo: "37", descricao: "Suíço" },
  { codigo: "38", descricao: "Italiano" },
  { codigo: "39", descricao: "Haitiano" },
  { codigo: "40", descricao: "Japonês" },
  { codigo: "41", descricao: "Chinês" },
  { codigo: "42", descricao: "Coreano" },
  { codigo: "43", descricao: "Russo" },
  { codigo: "44", descricao: "Português" },
  { codigo: "45", descricao: "Paquistanês" },
  { codigo: "46", descricao: "Indiano" },
  { codigo: "51", descricao: "Angolano" },
  { codigo: "60", descricao: "Outros Latino-Americanos" },
  { codigo: "70", descricao: "Outros Asiáticos" },
  { codigo: "80", descricao: "Outros Europeus" },
  { codigo: "90", descricao: "Outros Africanos" },
  { codigo: "99", descricao: "Outras Nacionalidades" },
] as const;

export type Nacionalidade = typeof nacionalidades[number];

export const getNacionalidadeByCodigo = (codigo: string) =>
  nacionalidades.find((n) => n.codigo === codigo);

export const nacionalidadeOptions = nacionalidades.map((n) => ({
  value: n.codigo,
  label: n.descricao,
}));

