import { lotacaoSchema } from "@/schemas/lotacaoSchema";
export const lotacaoValidator = {
  schema: lotacaoSchema,
  validate: (data: unknown) => lotacaoSchema.safeParse(data),
  validatePartial: (data: unknown) => lotacaoSchema.partial().safeParse(data),
  isValidCodigo: (codigo: string) => /^[A-Z0-9-]{1,30}$/.test(codigo),
  validateHierarchy: (lotacaoId: string, paiId?: string) => { if (lotacaoId === paiId) return "Lotação não pode ser pai de si mesma"; return null; },
};
export default lotacaoValidator;
