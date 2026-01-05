import { z } from "zod";
export const lotacaoSchema = z.object({
  id: z.string().uuid().optional(),
  codigo: z.string().min(1).max(30),
  descricao: z.string().min(1).max(100),
  tipo: z.enum(["DEPARTAMENTO", "FILIAL", "CENTRO_CUSTO", "PROJETO", "OBRA"]),
  empresaId: z.string().uuid(),
  lotacaoPaiId: z.string().uuid().optional(),
  codigoContabil: z.string().max(20).optional(),
  responsavelId: z.string().uuid().optional(),
  codigoESocial: z.string().max(30).optional(),
  ativo: z.boolean().default(true),
});
export type LotacaoInput = z.infer<typeof lotacaoSchema>;
export const validateLotacao = (data: unknown) => lotacaoSchema.safeParse(data);
export default lotacaoSchema;
