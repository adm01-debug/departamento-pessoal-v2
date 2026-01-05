import { z } from "zod";
export const emprestimoSchema = z.object({
  id: z.string().uuid().optional(),
  colaboradorId: z.string().uuid(),
  tipo: z.enum(["CONSIGNADO", "ANTECIPACAO_SALARIAL", "ADIANTAMENTO", "VALE"]),
  bancoId: z.string().uuid().optional(),
  contrato: z.string().max(50).optional(),
  valorTotal: z.number().positive(),
  taxaJuros: z.number().min(0).max(100).optional(),
  quantidadeParcelas: z.number().int().positive(),
  valorParcela: z.number().positive(),
  parcelasPagas: z.number().int().min(0).default(0),
  dataInicio: z.date(),
  dataFim: z.date().optional(),
  diaDesconto: z.number().int().min(1).max(31).default(5),
  margemUtilizada: z.number().min(0).optional(),
  situacao: z.enum(["ATIVO", "QUITADO", "CANCELADO", "SUSPENSO"]).default("ATIVO"),
  observacao: z.string().optional(),
});
export type EmprestimoInput = z.infer<typeof emprestimoSchema>;
export default emprestimoSchema;
