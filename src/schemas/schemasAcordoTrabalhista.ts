import { z } from 'zod';
export const acordoTrabalhistaSchema = z.object({ id: z.string(), colaboradorId: z.string(), dataAcordo: z.string(), tipo: z.enum(['compensacao', 'reducaoJornada', 'suspensaoContrato']), dataInicio: z.string(), dataFim: z.string(), descricao: z.string() });
export type AcordoTrabalhista = z.infer<typeof acordoTrabalhistaSchema>;
