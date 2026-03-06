import { z } from 'zod';

export const departamentoSchema = z.object({
  nome: z.string().min(2, 'Nome é obrigatório'),
  codigo: z.string().min(2, 'Código é obrigatório'),
  gestorId: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  telefone: z.string().optional(),
  centroCusto: z.string().optional(),
  ativo: z.boolean().default(true),
});

export type DepartamentoFormData = z.infer<typeof departamentoSchema>;
