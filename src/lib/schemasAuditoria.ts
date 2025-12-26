import { z } from 'zod';

export const filtroAuditoriaSchema = z.object({
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  usuarioId: z.string().uuid().optional(),
  acao: z.enum(['criar', 'atualizar', 'excluir', 'visualizar', 'exportar', 'importar']).optional(),
  entidade: z.string().optional(),
  entidadeId: z.string().uuid().optional(),
});

export const exportAuditoriaSchema = z.object({
  filtros: filtroAuditoriaSchema,
  formato: z.enum(['pdf', 'excel', 'csv']),
  incluirDetalhes: z.boolean().default(true),
});

export type FiltroAuditoria = z.infer<typeof filtroAuditoriaSchema>;
