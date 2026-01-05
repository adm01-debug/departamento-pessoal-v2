import { pensaoSchema } from "@/schemas/pensaoSchema";
export const pensaoValidator = {
  schema: pensaoSchema,
  validate: (data: unknown) => pensaoSchema.safeParse(data),
  calcularValor: (base: number, tipo: string, percentual?: number, valorFixo?: number): number => tipo === "PERCENTUAL" ? base * (percentual || 0) / 100 : valorFixo || 0,
};
export default pensaoValidator;
