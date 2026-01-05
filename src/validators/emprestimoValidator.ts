import { emprestimoSchema } from "@/schemas/emprestimoSchema";
export const emprestimoValidator = {
  schema: emprestimoSchema,
  validate: (data: unknown) => emprestimoSchema.safeParse(data),
  validatePartial: (data: unknown) => emprestimoSchema.partial().safeParse(data),
  calcularValorParcela: (valorTotal: number, parcelas: number, juros: number = 0) => { const fator = juros > 0 ? (juros/100 * Math.pow(1+juros/100, parcelas)) / (Math.pow(1+juros/100, parcelas) - 1) : 1/parcelas; return valorTotal * fator; },
  validarMargem: (margemDisponivel: number, valorParcela: number) => valorParcela <= margemDisponivel ? null : `Parcela (${valorParcela.toFixed(2)}) excede margem disponível (${margemDisponivel.toFixed(2)})`,
};
export default emprestimoValidator;
