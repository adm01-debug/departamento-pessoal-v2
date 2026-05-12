/**
 * Estimativa de aposentadoria baseada nas regras atuais da Previdência (Simulação Básica).
 */
export const calcularEstimativaAposentadoria = (idade: number, tempoContribuicao: number, mediaSalarial: number, sexo: 'M' | 'F') => {
  const idadeMinima = sexo === 'M' ? 65 : 62;
  const tempoMinimo = sexo === 'M' ? 20 : 15;
  
  const elegivel = idade >= idadeMinima && tempoContribuicao >= tempoMinimo;
  
  // Regra básica: 60% + 2% por ano que exceder 20 (H) ou 15 (M)
  const anosExcedentes = sexo === 'M' ? Math.max(0, tempoContribuicao - 20) : Math.max(0, tempoContribuicao - 15);
  const percentual = 0.6 + (anosExcedentes * 0.02);
  const valorEstimado = mediaSalarial * Math.min(1, percentual);
  
  return {
    elegivel,
    valorEstimado: Math.round(valorEstimado * 100) / 100,
    percentual: Math.round(percentual * 10000) / 100,
    faltamAnosIdade: Math.max(0, idadeMinima - idade),
    faltamAnosContribuicao: Math.max(0, tempoMinimo - tempoContribuicao)
  };
};

export default calcularEstimativaAposentadoria;
