import { z } from "zod";

export const jornadaSchema = z.object({
  id: z.string().uuid().optional(),
  codigo: z.string().min(1, "Código obrigatório").max(20),
  descricao: z.string().min(1, "Descrição obrigatória").max(100),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  horaFim: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  intervaloInicio: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM").optional(),
  intervaloFim: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM").optional(),
  cargaHorariaDiaria: z.number().min(1).max(24),
  cargaHorariaSemanal: z.number().min(1).max(168),
  cargaHorariaMensal: z.number().min(1).max(720),
  tipo: z.enum(["NORMAL", "FLEXIVEL", "ESCALA", "PLANTAO", "INTERMITENTE"]),
  diasSemana: z.array(z.number().min(0).max(6)),
  toleranciaEntrada: z.number().min(0).max(60).default(10),
  toleranciaSaida: z.number().min(0).max(60).default(10),
  permiteHoraExtra: z.boolean().default(true),
  permiteBancoHoras: z.boolean().default(false),
  ativo: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type JornadaInput = z.infer<typeof jornadaSchema>;
export const validateJornada = (data: unknown) => jornadaSchema.safeParse(data);
export default jornadaSchema;
