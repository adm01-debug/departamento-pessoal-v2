import { z } from "zod";
export const rescisaoValidator = {
  schema: z.object({ demissaoId: z.string().uuid(), dataCalculo: z.date(), saldoSalario: z.number(), avisoPrevio: z.number(), ferias: z.number(), decimoTerceiro: z.number(), fgts: z.number(), multa40: z.number() }),
  validate: (data: unknown) => rescisaoValidator.schema.safeParse(data),
  calcularPrazoPagamento: (tipo: string, dataDesligamento: Date): Date => { const dias = tipo === "PEDIDO" ? 10 : 10; return new Date(dataDesligamento.getTime() + dias * 86400000); },
};
export default rescisaoValidator;
