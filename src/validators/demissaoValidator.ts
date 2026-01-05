import { z } from "zod";
export const demissaoValidator = {
  schema: z.object({ colaboradorId: z.string().uuid(), data: z.date(), tipo: z.enum(["SEM_JUSTA_CAUSA", "JUSTA_CAUSA", "PEDIDO", "ACORDO"]), motivo: z.string().optional() }),
  validate: (data: unknown) => demissaoValidator.schema.safeParse(data),
  validarPrazos: (data: Date): { avisoPrevio: Date; homologacao: Date } => ({ avisoPrevio: new Date(data.getTime() + 30 * 86400000), homologacao: new Date(data.getTime() + 10 * 86400000) }),
};
export default demissaoValidator;
