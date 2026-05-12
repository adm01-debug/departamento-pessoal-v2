import { calcularDiferencaSalarial } from './calculoDiferenca';

/**
 * Cálculo de valores retroativos (ex: dissídio coletivo).
 */
export const calcularRetroativoDissidio = (salarioAnterior: number, novoSalario: number, mesesRetroativos: number) => {
  const diffMensal = calcularDiferencaSalarial(salarioAnterior, novoSalario).diferenca;
  const totalRetroativo = diffMensal * mesesRetroativos;
  
  return {
    diffMensal,
    mesesRetroativos,
    totalRetroativo: Math.round(totalRetroativo * 100) / 100
  };
};

export default calcularRetroativoDissidio;
