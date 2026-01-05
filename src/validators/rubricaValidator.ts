import { rubricaSchema } from "@/schemas/rubricaSchema";
export const rubricaValidator = {
  schema: rubricaSchema,
  validate: (data: unknown) => rubricaSchema.safeParse(data),
  validatePartial: (data: unknown) => rubricaSchema.partial().safeParse(data),
  isValidCodigo: (codigo: string) => /^[0-9]{1,10}$/.test(codigo),
  validateIncidencias: (rubrica: any) => { const errors: string[] = []; if (rubrica.tipo === "INFORMATIVA" && (rubrica.incideINSS || rubrica.incideIRRF)) errors.push("Rubrica informativa não deve ter incidências"); return errors; },
};
export default rubricaValidator;
