// V18: Calculadora de Salário Maternidade - Atualizada 2026
import { TETO_INSS_2026 } from '@/constants/tabelas.constants';

export const DIAS_LICENCA_MATERNIDADE = 120;
export const DIAS_LICENCA_EMPRESA_CIDADA = 180;

export interface ParamsMaternidade {
  salario: number;
  empresaCidada?: boolean;
  adocao?: boolean;
  idadeCriancaAdocao?: number;
  dataInicio?: string;
}

export interface ResultMaternidade {
  diasLicenca: number;
  dataInicio: string;
  dataFim: string;
  valorMensal: number;
  valorTotal: number;
  pagoINSS: number;
  pagoEmpresa: number;
  tetoAplicado: boolean;
}

/**
 * Calcula Salário Maternidade
 * CLT Art. 392 - Licença de 120 dias (180 Empresa Cidadã)
 */
export function calcularSalarioMaternidade(params: ParamsMaternidade): ResultMaternidade {
  const { 
    salario, 
    empresaCidada = false, 
    adocao = false, 
    idadeCriancaAdocao = 0,
    dataInicio = new Date().toISOString().split('T')[0]
  } = params;
  
  // Dias de licença
  let diasLicenca = empresaCidada ? DIAS_LICENCA_EMPRESA_CIDADA : DIAS_LICENCA_MATERNIDADE;
  
  // Adoção: dias variam conforme idade
  if (adocao && idadeCriancaAdocao > 0) {
    if (idadeCriancaAdocao <= 1) {
      diasLicenca = 120;
    } else if (idadeCriancaAdocao <= 4) {
      diasLicenca = 60;
    } else {
      diasLicenca = 30;
    }
  }
  
  // Calcular data fim
  const inicio = new Date(dataInicio);
  const fim = new Date(inicio);
  fim.setDate(fim.getDate() + diasLicenca);
  
  // Limitar ao teto INSS 2026
  const tetoAplicado = salario > TETO_INSS_2026;
  const salarioLimitado = Math.min(salario, TETO_INSS_2026);
  const valorDia = salarioLimitado / 30;
  
  // Valor total
  const valorTotal = Math.round(valorDia * diasLicenca * 100) / 100;
  
  // Divisão: INSS paga 120 dias, empresa cidadã paga 60 dias
  const pagoINSS = Math.round(valorDia * Math.min(diasLicenca, 120) * 100) / 100;
  const pagoEmpresa = empresaCidada ? Math.round(valorDia * 60 * 100) / 100 : 0;
  
  return {
    diasLicenca,
    dataInicio,
    dataFim: fim.toISOString().split('T')[0],
    valorMensal: salarioLimitado,
    valorTotal,
    pagoINSS,
    pagoEmpresa,
    tetoAplicado
  };
}

/**
 * Obtém teto INSS atual
 */
export function getTetoMaternidade(): number {
  return TETO_INSS_2026;
}

export default calcularSalarioMaternidade;
