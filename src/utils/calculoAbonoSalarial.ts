/**
 * Cálculo de Abono Salarial (PIS/PASEP)
 * Lei 7.998/90
 */
interface AbonoSalarialConfig {
  mesesTrabalhados: number;
  salarioMedioAnual: number;
  inscricaoPIS: string;
  anoBase: number;
}

interface AbonoSalarialResult {
  valor: number;
  elegivel: boolean;
  mesesConsiderados: number;
  motivoInelegibilidade?: string;
}

export function calcularAbonoSalarial(config: AbonoSalarialConfig): AbonoSalarialResult {
  const { mesesTrabalhados, salarioMedioAnual, anoBase } = config;
  const SALARIO_MINIMO = 1518.00;
  const LIMITE_SALARIOS = 2; // Até 2 salários mínimos

  if (salarioMedioAnual > SALARIO_MINIMO * LIMITE_SALARIOS) {
    return { valor: 0, elegivel: false, mesesConsiderados: 0, motivoInelegibilidade: 'Salário médio acima de 2 SM' };
  }
  if (mesesTrabalhados < 1) {
    return { valor: 0, elegivel: false, mesesConsiderados: 0, motivoInelegibilidade: 'Nenhum mês trabalhado' };
  }

  const mesesConsiderados = Math.min(mesesTrabalhados, 12);
  const valorProporcional = (SALARIO_MINIMO / 12) * mesesConsiderados;

  return {
    valor: Math.round(valorProporcional * 100) / 100,
    elegivel: true,
    mesesConsiderados,
  };
}

export function verificarElegibilidadeAbono(inscricaoPIS: string, anosInscricao: number): boolean {
  return inscricaoPIS.length === 11 && anosInscricao >= 5;
}

export default { calcularAbonoSalarial, verificarElegibilidadeAbono };
