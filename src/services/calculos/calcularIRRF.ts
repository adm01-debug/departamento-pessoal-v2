const DEDUCAO_DEPENDENTE = 189.59;
const FAIXAS_IRRF = [{ ate: 2259.20, aliquota: 0, deducao: 0 }, { ate: 2826.65, aliquota: 0.075, deducao: 169.44 }, { ate: 3751.05, aliquota: 0.15, deducao: 381.44 }, { ate: 4664.68, aliquota: 0.225, deducao: 662.77 }, { ate: Infinity, aliquota: 0.275, deducao: 896.00 }];
export function calcularIRRF(salarioBruto: number, inss: number, dependentes: number = 0, pensao: number = 0): { valor: number; aliquotaEfetiva: number; faixa: number; baseCalculo: number } {
  const deducaoDependentes = dependentes * DEDUCAO_DEPENDENTE;
  const baseCalculo = salarioBruto - inss - deducaoDependentes - pensao;
  if (baseCalculo <= FAIXAS_IRRF[0].ate) return { valor: 0, aliquotaEfetiva: 0, faixa: 0, baseCalculo };
  let irrf = 0;
  for (let i = FAIXAS_IRRF.length - 1; i >= 0; i--) {
    if (baseCalculo > FAIXAS_IRRF[i].ate || i === FAIXAS_IRRF.length - 1 && baseCalculo > FAIXAS_IRRF[i - 1]?.ate) {
      if (baseCalculo > FAIXAS_IRRF[i - 1]?.ate || i === 0) { irrf = baseCalculo * FAIXAS_IRRF[i].aliquota - FAIXAS_IRRF[i].deducao; break; }
    }
  }
  const aliquotaEfetiva = irrf > 0 ? (irrf / salarioBruto) * 100 : 0;
  const faixa = FAIXAS_IRRF.findIndex(f => baseCalculo <= f.ate);
  return { valor: Math.max(0, Math.round(irrf * 100) / 100), aliquotaEfetiva: Math.round(aliquotaEfetiva * 100) / 100, faixa: faixa >= 0 ? faixa : FAIXAS_IRRF.length - 1, baseCalculo };
}
export default calcularIRRF;
