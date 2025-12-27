import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  per_page: z.number().int().min(1).max(100).default(20),
});

export const sortSchema = z.object({
  sort_by: z.string(),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
});

export const filterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['pending', 'active', 'inactive', 'archived']).optional(),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
});

export const queryParamsSchema = paginationSchema.merge(sortSchema.partial()).merge(filterSchema);

export type PaginationInput = z.infer<typeof paginationSchema>;
export type SortInput = z.infer<typeof sortSchema>;
export type FilterInput = z.infer<typeof filterSchema>;
export type QueryParamsInput = z.infer<typeof queryParamsSchema>;
