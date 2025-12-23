import { z } from 'zod';

export const holeriteSchema = z.object({
  colaborador_id: z.string().uuid(),
  mes: z.number().min(1).max(12),
  ano: z.number().min(2020).max(2100),
  salario_base: z.number().min(0),
  horas_extras_valor: z.number().min(0).optional(),
  descontos_vt: z.number().min(0).optional(),
  descontos_vr: z.number().min(0).optional(),
  outros_proventos: z.number().min(0).optional(),
  outros_descontos: z.number().min(0).optional(),
});

export const gerarFolhaSchema = z.object({
  empresa_id: z.string().uuid(),
  mes: z.number().min(1).max(12),
  ano: z.number().min(2020).max(2100),
});

export const fecharFolhaSchema = z.object({
  folha_id: z.string().uuid(),
  data_pagamento: z.string().min(1),
});

export type HoleriteFormData = z.infer<typeof holeriteSchema>;
export type GerarFolhaData = z.infer<typeof gerarFolhaSchema>;
export type FecharFolhaData = z.infer<typeof fecharFolhaSchema>;
