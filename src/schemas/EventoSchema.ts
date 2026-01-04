import { z } from "zod";

export const EventoSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  descricao: z.string().max(500).optional(),
  ativo: z.boolean().default(true),
  dataCriacao: z.date().optional(),
  dataAtualizacao: z.date().optional(),
  metadata: z.record(z.any()).optional(),
});

export const EventoCreateSchema = EventoSchema.omit({ id: true, dataCriacao: true, dataAtualizacao: true });

export const EventoUpdateSchema = EventoSchema.partial().required({ id: true });

export const EventoFilterSchema = z.object({
  search: z.string().optional(),
  ativo: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type Evento = z.infer<typeof EventoSchema>;
export type EventoCreate = z.infer<typeof EventoCreateSchema>;
export type EventoUpdate = z.infer<typeof EventoUpdateSchema>;
export type EventoFilter = z.infer<typeof EventoFilterSchema>;

export function validateEvento(data: unknown): Evento {
  return EventoSchema.parse(data);
}

export function validateEventoCreate(data: unknown): EventoCreate {
  return EventoCreateSchema.parse(data);
}

export default { EventoSchema, EventoCreateSchema, EventoUpdateSchema, EventoFilterSchema };
