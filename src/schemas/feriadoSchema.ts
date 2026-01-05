import { z } from "zod";
export const feriadoSchema = z.object({ id: z.string().uuid().optional(), data: z.date(), descricao: z.string().min(1).max(100), tipo: z.enum(["NACIONAL", "ESTADUAL", "MUNICIPAL", "PONTO_FACULTATIVO"]), uf: z.string().length(2).optional(), municipioId: z.string().uuid().optional(), recorrente: z.boolean().default(false), ativo: z.boolean().default(true) });
export type FeriadoInput = z.infer<typeof feriadoSchema>;
export default feriadoSchema;
