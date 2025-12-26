import { z } from 'zod';

export const feriadoFormSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  data: z.string().min(1, 'Data obrigatória'),
  tipo: z.enum(['nacional', 'estadual', 'municipal', 'ponto_facultativo']),
  recorrente: z.boolean().default(false),
  estado: z.string().length(2).optional(),
  cidade: z.string().optional(),
  observacoes: z.string().optional(),
}).refine(data => data.tipo !== 'estadual' || data.estado, {
  message: 'Estado obrigatório para feriados estaduais',
  path: ['estado'],
}).refine(data => data.tipo !== 'municipal' || (data.estado && data.cidade), {
  message: 'Estado e cidade obrigatórios para feriados municipais',
  path: ['cidade'],
});

export type FeriadoFormData = z.infer<typeof feriadoFormSchema>;
