import { z } from "zod";
const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const telefoneRegex = /^\d{10,11}$|^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
export const rescisaoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(3).max(100),
  colaboradorId: z.string().uuid(), dataRescisao: z.string(), tipoRescisao: z.enum(["sem_justa_causa", "justa_causa", "pedido_demissao", "acordo"]), valorTotal: z.number(), status: z.enum(["calculada", "homologada", "paga"]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type rescisaoSchemaType = z.infer<typeof rescisaoSchema>;
export const validaterescisaoSchema = (data: unknown) => rescisaoSchema.safeParse(data);
export default rescisaoSchema;
