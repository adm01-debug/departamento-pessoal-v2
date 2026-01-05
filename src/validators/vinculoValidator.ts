import { z } from "zod";
import { vinculoSchema } from "@/schemas/vinculoSchema";
export const vinculoValidator = {
  schema: vinculoSchema,
  validate: (data: unknown) => vinculoSchema.safeParse(data),
  validatePartial: (data: unknown) => vinculoSchema.partial().safeParse(data),
  isValidMatricula: (matricula: string) => /^[A-Z0-9]{1,20}$/.test(matricula),
  validateSalario: (salario: number, tipo: string) => { if (salario <= 0) return "Salário deve ser positivo"; if (tipo === "MENSAL" && salario < 1412) return "Salário abaixo do mínimo"; return null; },
  validateDatas: (admissao: Date, desligamento?: Date) => { if (desligamento && desligamento < admissao) return "Data de desligamento anterior à admissão"; return null; },
};
export default vinculoValidator;
