// V14-061: motivosAfastamento.ts
export const motivosAfastamento = [
  { codigo: "01", descricao: "Acidente/Doença do Trabalho" },
  { codigo: "03", descricao: "Acidente/Doença não relacionada ao trabalho" },
  { codigo: "05", descricao: "Afastamento/Licença prevista em regime próprio" },
  { codigo: "06", descricao: "Aposentadoria por invalidez" },
  { codigo: "07", descricao: "Acompanhamento - Licença para acompanhamento de familiar" },
  { codigo: "08", descricao: "Afastamento do empregado para participação em atividade sindical" },
  { codigo: "10", descricao: "Afastamento/licença de servidor público prevista em lei" },
  { codigo: "11", descricao: "Cárcere" },
  { codigo: "12", descricao: "Cargo Eletivo - Afastamento para exercício de mandato eletivo" },
  { codigo: "13", descricao: "Cidadania/Serviço Militar" },
  { codigo: "14", descricao: "Cessão/Requisição" },
  { codigo: "15", descricao: "Gozo de férias ou recesso" },
  { codigo: "16", descricao: "Licença remunerada - Lei, liberalidade, CCT, ACT, sentença" },
  { codigo: "17", descricao: "Licença Maternidade - 120 dias" },
  { codigo: "18", descricao: "Licença Maternidade - 180 dias" },
  { codigo: "19", descricao: "Licença Maternidade - Antecipação e/ou prorrogação" },
  { codigo: "20", descricao: "Licença Maternidade - Empresa Cidadã" },
  { codigo: "21", descricao: "Licença não remunerada ou sem vencimento" },
  { codigo: "22", descricao: "Licença Paternidade" },
  { codigo: "23", descricao: "Licença por Motivo de Casamento" },
  { codigo: "24", descricao: "Licença por Motivo de Óbito de Familiar" },
  { codigo: "25", descricao: "Mulher Vítima de Violência" },
  { codigo: "26", descricao: "Participação em desportiva" },
  { codigo: "27", descricao: "Qualificação - Afastamento para participação em curso" },
  { codigo: "28", descricao: "Representação sindical - Afastamento por tempo indeterminado" },
  { codigo: "29", descricao: "Serviço Militar - Afastamento para prestação de serviço militar" },
  { codigo: "30", descricao: "Suspensão disciplinar" },
  { codigo: "31", descricao: "Suspensão do contrato - Art. 476-A CLT" },
  { codigo: "33", descricao: "Licença Maternidade - Aborto não criminoso" },
  { codigo: "34", descricao: "Licença Maternidade - Adoção" },
  { codigo: "35", descricao: "Licença Maternidade - Guarda Judicial" },
  { codigo: "37", descricao: "Inatividade do trabalhador avulso" },
  { codigo: "38", descricao: "Afastamento por suspensão temporária do contrato" },
] as const;

export type MotivoAfastamento = typeof motivosAfastamento[number];

export const getMotivoByCodigo = (codigo: string) =>
  motivosAfastamento.find((m) => m.codigo === codigo);

