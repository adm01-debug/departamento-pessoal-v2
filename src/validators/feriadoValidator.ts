import { feriadoSchema } from "@/schemas/feriadoSchema";
export const feriadoValidator = { schema: feriadoSchema, validate: (data: unknown) => feriadoSchema.safeParse(data), isDataValida: (data: Date): boolean => !isNaN(data.getTime()) };
export default feriadoValidator;
