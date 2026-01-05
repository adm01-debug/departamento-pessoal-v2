import { afastamentoSchema } from "@/schemas/afastamentoSchema";
export const afastamentoValidator = {
  schema: afastamentoSchema,
  validate: (data: unknown) => afastamentoSchema.safeParse(data),
  calcularDias: (inicio: Date, fim: Date): number => Math.ceil((fim.getTime() - inicio.getTime()) / 86400000) + 1,
  verificarINSS: (tipo: string, dias: number): boolean => tipo === "DOENCA" && dias > 15,
  validarPeriodo: (inicio: Date, fim?: Date): string[] => { const erros: string[] = []; if (fim && fim < inicio) erros.push("Data fim anterior ao início"); return erros; },
};
export default afastamentoValidator;
