export const calculoAposentadoria = (salarioMedio: number, anosContribuicao: number, idade: number) => {
  // Estimativa simplificada baseada na Reforma da Previdência 2019/2026
  const coeficiente = 0.6 + (anosContribuicao > 20 ? (anosContribuicao - 20) * 0.02 : 0);
  const valorEstimado = salarioMedio * Math.min(1, coeficiente);
  return { 
    valorEstimado: Math.round(valorEstimado * 100) / 100, 
    coeficiente: Math.round(coeficiente * 100) / 100,
    regra: '60% + 2% por ano após 20 anos'
  };
};
