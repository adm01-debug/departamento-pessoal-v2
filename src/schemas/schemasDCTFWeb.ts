import { z } from 'zod';
export const dctfWebSchema = z.object({ id: z.string(), competencia: z.string(), empresaId: z.string(), status: z.enum(['pendente', 'enviado', 'aceito', 'rejeitado']), dataEnvio: z.string().optional(), protocolo: z.string().optional(), valores: z.object({ inss: z.number(), irrf: z.number(), fgts: z.number() }) });
export type DCTFWeb = z.infer<typeof dctfWebSchema>;
