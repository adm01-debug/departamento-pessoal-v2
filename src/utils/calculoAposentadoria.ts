/**
 * Cálculo de Aposentadoria (Regras EC 103/2019)
 */
interface AposentadoriaConfig {
  tipoAposentadoria: 'idade' | 'tempo_contribuicao' | 'especial' | 'invalidez';
  sexo: 'M' | 'F';
  idadeAtual: number;
  tempoContribuicao: number;
  salariosContribuicao: number[];
  exposicaoAgentesNocivos?: number;
}

interface AposentadoriaResult {
  elegivel: boolean;
  idadeMinima: number;
  tempoMinimoContribuicao: number;
  salarioBeneficio: number;
  coeficiente: number;
  valorBeneficio: number;
  regrasTransicao: string[];
}

const TETO_INSS = 7786.02;
const PISO_INSS = 1518.00;

export function calcularAposentadoria(config: AposentadoriaConfig): AposentadoriaResult {
  const { tipoAposentadoria, sexo, idadeAtual, tempoContribuicao, salariosContribuicao } = config;

  let idadeMinima = sexo === 'F' ? 62 : 65;
  let tempoMinimoContribuicao = sexo === 'F' ? 15 : 20;
  const regrasTransicao: string[] = [];

  if (tipoAposentadoria === 'especial') {
    idadeMinima = 55;
    tempoMinimoContribuicao = 15;
  }

  const elegivel = idadeAtual >= idadeMinima && tempoContribuicao >= tempoMinimoContribuicao;
  const media = salariosContribuicao.length > 0 ? salariosContribuicao.reduce((a, b) => a + b, 0) / salariosContribuicao.length : 0;
  const salarioBeneficio = Math.min(media, TETO_INSS);
  
  let coeficiente = 0.6 + (tempoContribuicao - tempoMinimoContribuicao) * 0.02;
  coeficiente = Math.min(coeficiente, 1);

  let valorBeneficio = salarioBeneficio * coeficiente;
  valorBeneficio = Math.max(valorBeneficio, PISO_INSS);

  return { elegivel, idadeMinima, tempoMinimoContribuicao, salarioBeneficio: Math.round(salarioBeneficio * 100) / 100, coeficiente, valorBeneficio: Math.round(valorBeneficio * 100) / 100, regrasTransicao };
}

export default { calcularAposentadoria };
