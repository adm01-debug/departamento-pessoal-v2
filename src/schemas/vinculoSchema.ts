import { z } from "zod";
export const vinculoSchema = z.object({
  id: z.string().uuid().optional(),
  colaboradorId: z.string().uuid(),
  empresaId: z.string().uuid(),
  tipoVinculo: z.enum(["CLT", "ESTAGIO", "TEMPORARIO", "AUTONOMO", "PJ", "AVULSO", "DOMESTICO", "APRENDIZ"]),
  dataAdmissao: z.date(),
  dataDesligamento: z.date().optional(),
  matricula: z.string().min(1).max(20),
  cargoId: z.string().uuid(),
  departamentoId: z.string().uuid(),
  jornadaId: z.string().uuid().optional(),
  salarioBase: z.number().positive(),
  tipoSalario: z.enum(["MENSAL", "HORA", "TAREFA", "COMISSAO"]),
  formaPagamento: z.enum(["DEPOSITO", "PIX", "CHEQUE", "DINHEIRO"]),
  contaBancaria: z.string().optional(),
  categoriaESocial: z.string().max(3),
  sindicatoId: z.string().uuid().optional(),
  ativo: z.boolean().default(true),
});
export type VinculoInput = z.infer<typeof vinculoSchema>;
export const validateVinculo = (data: unknown) => vinculoSchema.safeParse(data);
export default vinculoSchema;
