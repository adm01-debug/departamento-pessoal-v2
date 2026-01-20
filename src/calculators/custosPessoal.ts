// V20-022: Calculadora de Custos com Pessoal
export interface CustosPessoalParams {
  salarioBase: number;
  beneficios?: {
    valeTransporte?: number;
    valeRefeicao?: number;
    planoSaude?: number;
    outros?: number;
  };
  incluirProvisoes?: boolean;
}

export interface CustosPessoalResult {
  salarioBruto: number;
  encargos: {
    inssPatronal: number;
    fgts: number;
    rat: number;
    terceiros: number;
    total: number;
  };
  provisoes: {
    ferias: number;
    decimoTerceiro: number;
    total: number;
  };
  beneficios: {
    valeTransporte: number;
    valeRefeicao: number;
    planoSaude: number;
    outros: number;
    total: number;
  };
  custoTotal: number;
  custoHora: number;
  multiplicador: number;
}

export function calcularCustosPessoal(params: CustosPessoalParams): CustosPessoalResult {
  const { salarioBase, beneficios = {}, incluirProvisoes = true } = params;
  
  // Encargos
  const inssPatronal = salarioBase * 0.20;
  const fgts = salarioBase * 0.08;
  const rat = salarioBase * 0.02;
  const terceiros = salarioBase * 0.058;
  const totalEncargos = inssPatronal + fgts + rat + terceiros;

  // Provisões (base mensal)
  const ferias = incluirProvisoes ? (salarioBase / 12) * 1.3333 : 0; // Com 1/3
  const decimoTerceiro = incluirProvisoes ? salarioBase / 12 : 0;
  const totalProvisoes = ferias + decimoTerceiro;

  // Benefícios
  const vt = beneficios.valeTransporte || 0;
  const vr = beneficios.valeRefeicao || 0;
  const ps = beneficios.planoSaude || 0;
  const outros = beneficios.outros || 0;
  const totalBeneficios = vt + vr + ps + outros;

  const custoTotal = salarioBase + totalEncargos + totalProvisoes + totalBeneficios;
  const custoHora = custoTotal / 220; // Jornada mensal padrão
  const multiplicador = custoTotal / salarioBase;

  return {
    salarioBruto: r(salarioBase),
    encargos: { inssPatronal: r(inssPatronal), fgts: r(fgts), rat: r(rat), terceiros: r(terceiros), total: r(totalEncargos) },
    provisoes: { ferias: r(ferias), decimoTerceiro: r(decimoTerceiro), total: r(totalProvisoes) },
    beneficios: { valeTransporte: r(vt), valeRefeicao: r(vr), planoSaude: r(ps), outros: r(outros), total: r(totalBeneficios) },
    custoTotal: r(custoTotal),
    custoHora: r(custoHora),
    multiplicador: Math.round(multiplicador * 100) / 100
  };
}

function r(v: number): number { return Math.round(v * 100) / 100; }

export default calcularCustosPessoal;
