import { z } from "zod";
import { jornadaSchema } from "@/schemas/jornadaSchema";

export const jornadaValidator = {
  schema: jornadaSchema,

  validate(data: unknown) {
    return jornadaSchema.safeParse(data);
  },

  validatePartial(data: unknown) {
    return jornadaSchema.partial().safeParse(data);
  },

  isValidHorario(hora: string): boolean {
    return /^\d{2}:\d{2}$/.test(hora);
  },

  isValidIntervalo(inicio: string, fim: string): boolean {
    if (!this.isValidHorario(inicio) || !this.isValidHorario(fim)) return false;
    const [hi, mi] = inicio.split(":").map(Number);
    const [hf, mf] = fim.split(":").map(Number);
    return (hf * 60 + mf) > (hi * 60 + mi);
  },

  validateCargaHoraria(diaria: number, semanal: number, mensal: number): string[] {
    const errors: string[] = [];
    if (diaria > 24) errors.push("Carga diária não pode exceder 24 horas");
    if (semanal > 168) errors.push("Carga semanal não pode exceder 168 horas");
    if (mensal > 720) errors.push("Carga mensal não pode exceder 720 horas");
    if (semanal < diaria) errors.push("Carga semanal deve ser maior que diária");
    if (mensal < semanal) errors.push("Carga mensal deve ser maior que semanal");
    return errors;
  },

  validateDiasSemana(dias: number[]): boolean {
    return dias.every(d => d >= 0 && d <= 6) && dias.length > 0;
  },
};

export default jornadaValidator;
