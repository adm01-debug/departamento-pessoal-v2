export const calculoAjudaCusto = (valor: number) => {
  // Ajuda de custo não tem incidência de encargos conforme CLT Art. 457 § 2º
  return { bruto: valor, liquido: valor };
};
