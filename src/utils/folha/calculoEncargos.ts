import { calcularEncargos as calcBase } from '@/calculators/rescisao';

/**
 * Estimativa de encargos sociais sobre a folha de pagamento (FGTS, INSS Patronal, RAT, Terceiros).
 */
export const calcularEncargosFolha = (valorFolha: number, percentualRAT: number = 0.03, percentualTerceiros: number = 0.058) => {
  return calcBase(valorFolha, percentualRAT, percentualTerceiros);
};

export default calcularEncargosFolha;
