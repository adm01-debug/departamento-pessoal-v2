import { sindicatoSchema } from "@/schemas/sindicatoSchema";
export const sindicatoValidator = { schema: sindicatoSchema, validate: (data: unknown) => sindicatoSchema.safeParse(data), validateCNPJ: (cnpj: string): boolean => cnpj.length === 14 };
export default sindicatoValidator;
