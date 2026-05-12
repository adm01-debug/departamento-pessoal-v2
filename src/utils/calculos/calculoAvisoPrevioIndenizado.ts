import { calcularAvisoPrevioIndenizado } from '@/calculators/rescisao';

export const calculoAvisoPrevioIndenizado = (salarioBase: number, anosServico: number) => {
  return calcularAvisoPrevioIndenizado(salarioBase, anosServico);
};
