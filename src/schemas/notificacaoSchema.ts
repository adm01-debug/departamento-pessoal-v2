import { z } from "zod";
export const notificacaoSchema = z.object({ id: z.string().uuid().optional(), usuarioId: z.string().uuid(), tipo: z.enum(["SISTEMA", "TAREFA", "ALERTA", "LEMBRETE", "APROVACAO", "INFO"]), titulo: z.string().min(1).max(100), mensagem: z.string().min(1), link: z.string().optional(), lida: z.boolean().default(false), dataEnvio: z.date(), dataLeitura: z.date().optional() });
export type NotificacaoInput = z.infer<typeof notificacaoSchema>;
export default notificacaoSchema;
