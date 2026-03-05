import { z } from 'zod';

export const colaboradorSchema = z.object({
  nome: z.string().min(3),
  cpf: z.string().min(11),
  email: z.string().email().optional().or(z.literal('')),
  telefone: z.string().optional(),
  data_nascimento: z.string().optional(),
  dataAdmissao: z.string().min(1),
  salario: z.number().positive(),
  cargoId: z.string().optional(),
  departamentoId: z.string().optional(),
  tipo_contrato: z.enum(['clt', 'pj', 'estagio', 'temporario', 'autonomo']).default('clt'),
  status: z.enum(['ativo', 'inativo', 'ferias', 'afastado', 'demitido']).default('ativo'),
});

export type ColaboradorSchema = z.infer<typeof colaboradorSchema>;
export type ColaboradorFormData = z.infer<typeof colaboradorSchema>;
