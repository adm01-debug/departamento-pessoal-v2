/**
 * Cálculo de Salário-Maternidade
 * Baseado na Lei 8.213/91 e alterações
 */

type TipoSegurada = 'empregada' | 'domestica' | 'contribuinte_individual' | 'facultativa' | 'segurada_especial';

interface SalarioMaternidadeConfig {
  tipoSegurada: TipoSegurada;
  salarioContribuicao: number;
  ultimasSalariosContribuicao?: number[]; // últimos 12 meses para CI/Facultativa
  diasLicenca: number; // 120, 180 (empresa cidadã), ou proporcional
  dataInicioLicenca: Date;
}

interface SalarioMaternidadeResult {
  valorMensal: number;
  valorTotal: number;
  diasConcedidos: number;
  pagoPorINSS: boolean;
  pagoPorEmpresa: boolean;
  observacoes: string[];
}

export function calcularSalarioMaternidade(config: SalarioMaternidadeConfig): SalarioMaternidadeResult {
  const { tipoSegurada, salarioContribuicao, ultimasSalariosContribuicao, diasLicenca } = config;
  
  let valorMensal: number;
  let pagoPorINSS = false;
  let pagoPorEmpresa = false;
  const observacoes: string[] = [];
  
  // Teto INSS 2025
  const TETO_INSS = 7786.02;
  
  switch (tipoSegurada) {
    case 'empregada':
    case 'domestica':
      // Valor integral do salário, sem limite do teto
      valorMensal = salarioContribuicao;
      pagoPorEmpresa = true;
      observacoes.push('Empresa paga e compensa na GPS');
      break;
    
    case 'contribuinte_individual':
    case 'facultativa':
      // Média dos últimos 12 salários de contribuição
      if (ultimasSalariosContribuicao && ultimasSalariosContribuicao.length > 0) {
        const media = ultimasSalariosContribuicao.reduce((a, b) => a + b, 0) / ultimasSalariosContribuicao.length;
        valorMensal = Math.min(media, TETO_INSS);
      } else {
        valorMensal = Math.min(salarioContribuicao, TETO_INSS);
      }
      pagoPorINSS = true;
      observacoes.push('Pago diretamente pelo INSS');
      break;
    
    case 'segurada_especial':
      // Um salário mínimo
      valorMensal = 1518.00; // Salário mínimo 2025
      pagoPorINSS = true;
      observacoes.push('Valor fixo de um salário mínimo');
      break;
    
    default:
      valorMensal = salarioContribuicao;
  }
  
  // Calcular valor total proporcional aos dias
  const valorDiario = valorMensal / 30;
  const valorTotal = valorDiario * diasLicenca;
  
  if (diasLicenca === 180) {
    observacoes.push('Empresa Cidadã - 60 dias adicionais');
  }
  
  return {
    valorMensal: Math.round(valorMensal * 100) / 100,
    valorTotal: Math.round(valorTotal * 100) / 100,
    diasConcedidos: diasLicenca,
    pagoPorINSS,
    pagoPorEmpresa,
    observacoes,
  };
}

export function calcularCarenciaSalarioMaternidade(contribuicoes: number, tipoSegurada: TipoSegurada): boolean {
  // Empregada e doméstica: sem carência
  if (tipoSegurada === 'empregada' || tipoSegurada === 'domestica') return true;
  // Demais: 10 contribuições mensais
  return contribuicoes >= 10;
}

export default { calcularSalarioMaternidade, calcularCarenciaSalarioMaternidade };
