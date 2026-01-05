import { eventoSchema } from "@/schemas/eventoSchema";
export const eventoValidator = { schema: eventoSchema, validate: (data: unknown) => eventoSchema.safeParse(data), validarValor: (tipo: string, valor: number): boolean => tipo === "DESCONTO" ? valor >= 0 : valor >= 0 };
export default eventoValidator;
