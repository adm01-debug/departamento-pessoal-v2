import { z } from "zod";
export const comunicadoSchema = z.object({ id: z.string().uuid().optional(), titulo: z.string().min(1).max(200), conteudo: z.string().min(1), tipo: z.enum(["GERAL", "RH", "FINANCEIRO", "TI", "SEGURANCA", "URGENTE"]), prioridade: z.enum(["BAIXA", "MEDIA", "ALTA", "URGENTE"]).default("MEDIA"), dataPublicacao: z.date(), dataExpiracao: z.date().optional(), destinatarios: z.array(z.string()).optional(), departamentos: z.array(z.string()).optional(), anexos: z.array(z.string()).optional(), autorId: z.string().uuid(), ativo: z.boolean().default(true) });
export type ComunicadoInput = z.infer<typeof comunicadoSchema>;
export default comunicadoSchema;
