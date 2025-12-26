import { z } from 'zod';

export const cargoFormSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  descricao: z.string().optional(),
  cbo: z.string().regex(/^\d{6}$/, 'CBO deve ter 6 dígitos').optional(),
  nivelHierarquico: z.enum(['operacional', 'tecnico', 'supervisao', 'gerencia', 'diretoria']),
  salarioBase: z.number().positive('Salário base deve ser positivo').optional(),
  salarioTeto: z.number().positive('Salário teto deve ser positivo').optional(),
  ativo: z.boolean().default(true),
}).refine(data => !data.salarioTeto || !data.salarioBase || data.salarioTeto >= data.salarioBase, {
  message: 'Salário teto deve ser maior ou igual ao salário base',
  path: ['salarioTeto'],
});

export type CargoFormData = z.infer<typeof cargoFormSchema>;
