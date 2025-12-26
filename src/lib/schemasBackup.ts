import { z } from 'zod';

export const backupConfigSchema = z.object({
  automatico: z.boolean().default(true),
  frequencia: z.enum(['diario', 'semanal', 'mensal']),
  horario: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido'),
  retencaoDias: z.number().int().positive().max(365),
  incluirAnexos: z.boolean().default(true),
});

export const restoreSchema = z.object({
  backupId: z.string().uuid(),
  confirmar: z.literal(true, { errorMap: () => ({ message: 'Confirmação obrigatória' }) }),
});

export type BackupConfig = z.infer<typeof backupConfigSchema>;
