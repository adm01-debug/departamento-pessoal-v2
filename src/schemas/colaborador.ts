// V15-281
import { z } from 'zod';
export const colaboradorSchema = z.object({
  nome: z.string().min(3),
  cpf: z.string().length(11),
  email: z.string().email().optional().or(z.literal('')),
  telefone: z.string().optional(),
  data_nascimento: z.string().optional(),
  data_admissao: z.string().min(1),
  salario: z.number().positive(),
  cargo_id: z.string().optional(),
  departamento_id: z.string().optional(),
  tipo_contrato: z.enum(['clt', 'pj', 'estagio', 'temporario', 'autonomo']).default('clt'),
  status: z.enum(['ativo', 'inativo', 'ferias', 'afastado', 'demitido']).default('ativo'),
});
export type ColaboradorSchema = z.infer<typeof colaboradorSchema>;
