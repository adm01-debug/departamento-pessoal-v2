import { calcularEncargos as calcBase } from '@/calculators/rescisao';

/**
 * Estimativa de encargos sociais sobre a folha de pagamento (FGTS, INSS Patronal, RAT, Terceiros).
 */
export const calcularEncargosFolha = (valorFolha: number, aliquotaPatronal: number = 0.20, aliquotaRAT: number = 0.02, aliquotaTerceiros: number = 0.058) => {
  return calcBase(valorFolha, aliquotaPatronal, aliquotaRAT, aliquotaTerceiros);
};

export default calcularEncargosFolha;
