import { z } from "zod";
const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const cnpjRegex = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const telefoneRegex = /^\d{10,11}$|^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
export const documentoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(3).max(100),
  tipo: z.string(), arquivo: z.string(), tamanho: z.number(), colaboradorId: z.string().uuid().optional(), dataUpload: z.string(), status: z.enum(["pendente", "aprovado", "rejeitado"]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});
export type documentoSchemaType = z.infer<typeof documentoSchema>;
export const validatedocumentoSchema = (data: unknown) => documentoSchema.safeParse(data);
export default documentoSchema;
