import { z } from "zod";
export const rubricaSchema = z.object({
  id: z.string().uuid().optional(),
  codigo: z.string().min(1).max(10),
  descricao: z.string().min(1).max(100),
  tipo: z.enum(["PROVENTO", "DESCONTO", "INFORMATIVA"]),
  natureza: z.enum(["SALARIO", "HORA_EXTRA", "DSR", "ADICIONAL_NOTURNO", "INSALUBRIDADE", "PERICULOSIDADE", "COMISSAO", "FERIAS", "13_SALARIO", "BENEFICIO", "IMPOSTO", "CONTRIBUICAO", "OUTROS"]),
  incideINSS: z.boolean().default(false),
  incideIRRF: z.boolean().default(false),
  incideFGTS: z.boolean().default(false),
  incideFerias: z.boolean().default(false),
  incide13: z.boolean().default(false),
  codigoESocial: z.string().max(10).optional(),
  formula: z.string().optional(),
  ativo: z.boolean().default(true),
});
export type RubricaInput = z.infer<typeof rubricaSchema>;
export const validateRubrica = (data: unknown) => rubricaSchema.safeParse(data);
export default rubricaSchema;
