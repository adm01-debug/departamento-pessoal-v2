import { z } from 'zod';

export const filtroRelatorioSchema = z.object({
  dataInicio: z.string().min(1, 'Data início obrigatória'),
  dataFim: z.string().min(1, 'Data fim obrigatória'),
  departamentos: z.array(z.string()).optional(),
  cargos: z.array(z.string()).optional(),
  colaboradores: z.array(z.string()).optional(),
});

export const relatorioConfigSchema = z.object({
  tipo: z.enum(['folha', 'ferias', 'ponto', 'beneficios', 'admissoes', 'desligamentos', 'headcount', 'turnover', 'absenteismo', 'custom']),
  titulo: z.string().min(1, 'Título obrigatório'),
  formato: z.enum(['pdf', 'excel', 'csv', 'json']),
  filtros: filtroRelatorioSchema,
  agendado: z.boolean().default(false),
  periodicidade: z.enum(['diario', 'semanal', 'mensal', 'trimestral', 'anual']).optional(),
});

export type RelatorioConfig = z.infer<typeof relatorioConfigSchema>;
