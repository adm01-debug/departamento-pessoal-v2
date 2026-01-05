const SALARIO_MINIMO = 1518;
const TETO_INSS = 8157.41;
const FAIXAS_INSS = [{ ate: 1518, aliquota: 0.075 }, { ate: 2793.88, aliquota: 0.09 }, { ate: 4190.83, aliquota: 0.12 }, { ate: 8157.41, aliquota: 0.14 }];
export function calcularINSS(salario: number): { valor: number; aliquotaEfetiva: number; faixa: number } {
  if (salario <= 0) return { valor: 0, aliquotaEfetiva: 0, faixa: 0 };
  let inss = 0; let baseAnterior = 0;
  for (let i = 0; i < FAIXAS_INSS.length; i++) {
    const faixa = FAIXAS_INSS[i];
    if (salario <= faixa.ate) { inss += (salario - baseAnterior) * faixa.aliquota; break; }
    inss += (faixa.ate - baseAnterior) * faixa.aliquota;
    baseAnterior = faixa.ate;
  }
  const aliquotaEfetiva = (inss / salario) * 100;
  const faixa = FAIXAS_INSS.findIndex(f => salario <= f.ate) + 1 || FAIXAS_INSS.length;
  return { valor: Math.round(inss * 100) / 100, aliquotaEfetiva: Math.round(aliquotaEfetiva * 100) / 100, faixa };
}
export default calcularINSS;
