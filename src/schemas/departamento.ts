import { z } from 'zod';

export const departamentoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  codigo: z.string().min(2, 'Código deve ter pelo menos 2 caracteres').max(10).optional(),
  sigla: z.string().min(2, 'Sigla deve ter pelo menos 2 caracteres').max(10).optional(),
  descricao: z.string().optional(),
  gestorId: z.string().optional(),
  centroCusto: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  telefone: z.string().optional(),
  ativo: z.boolean(),
});

export type DepartamentoFormData = z.infer<typeof departamentoSchema>;
