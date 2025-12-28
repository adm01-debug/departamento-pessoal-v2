/**
 * Cálculo de Auxílio por Incapacidade Temporária (antigo Auxílio-Doença)
 * Lei 8.213/91 com alterações da EC 103/2019
 */

interface AuxilioDoencaConfig {
  salariosContribuicao: number[]; // Últimos 12 meses ou desde 07/1994
  diasAfastamento: number;
  tipoAuxilio: 'previdenciario' | 'acidentario';
  dataInicioIncapacidade: Date;
}

interface AuxilioDoencaResult {
  salarioBeneficio: number;
  rendaMensal: number;
  valorDiario: number;
  valorTotal: number;
  percentualAplicado: number;
  observacoes: string[];
}

export function calcularAuxilioDoenca(config: AuxilioDoencaConfig): AuxilioDoencaResult {
  const { salariosContribuicao, diasAfastamento, tipoAuxilio } = config;
  const TETO_INSS = 7786.02;
  const PISO_INSS = 1518.00;
  const observacoes: string[] = [];
  
  // Calcular média dos salários de contribuição
  const salariosFiltrados = salariosContribuicao.filter(s => s > 0);
  if (salariosFiltrados.length === 0) {
    return {
      salarioBeneficio: PISO_INSS,
      rendaMensal: PISO_INSS,
      valorDiario: PISO_INSS / 30,
      valorTotal: (PISO_INSS / 30) * diasAfastamento,
      percentualAplicado: 100,
      observacoes: ['Sem salários de contribuição - aplicado piso'],
    };
  }
  
  // Média aritmética simples de todos os salários
  const media = salariosFiltrados.reduce((a, b) => a + b, 0) / salariosFiltrados.length;
  
  // Salário de benefício limitado ao teto
  const salarioBeneficio = Math.min(media, TETO_INSS);
  
  // Renda mensal: 91% do salário de benefício (EC 103/2019)
  const percentualAplicado = 91;
  let rendaMensal = salarioBeneficio * 0.91;
  
  // Garantir piso
  if (rendaMensal < PISO_INSS) {
    rendaMensal = PISO_INSS;
    observacoes.push('Valor ajustado ao piso previdenciário');
  }
  
  // Auxílio acidentário tem estabilidade de 12 meses após retorno
  if (tipoAuxilio === 'acidentario') {
    observacoes.push('Auxílio acidentário: estabilidade de 12 meses após retorno');
  }
  
  // Primeiros 15 dias pagos pela empresa
  const diasINSS = Math.max(0, diasAfastamento - 15);
  observacoes.push(`Primeiros 15 dias pagos pela empresa. INSS paga ${diasINSS} dias.`);
  
  const valorDiario = rendaMensal / 30;
  const valorTotal = valorDiario * diasINSS;
  
  return {
    salarioBeneficio: Math.round(salarioBeneficio * 100) / 100,
    rendaMensal: Math.round(rendaMensal * 100) / 100,
    valorDiario: Math.round(valorDiario * 100) / 100,
    valorTotal: Math.round(valorTotal * 100) / 100,
    percentualAplicado,
    observacoes,
  };
}

export function verificarCarenciaAuxilioDoenca(contribuicoes: number, tipoAuxilio: string): boolean {
  // Auxílio acidentário: sem carência
  if (tipoAuxilio === 'acidentario') return true;
  // Auxílio previdenciário: 12 contribuições
  return contribuicoes >= 12;
}

export default { calcularAuxilioDoenca, verificarCarenciaAuxilioDoenca };
