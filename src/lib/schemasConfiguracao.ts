import { z } from 'zod';

export const configuracaoEmpresaSchema = z.object({
  logoUrl: z.string().url().optional(),
  corPrimaria: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  corSecundaria: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  timezone: z.string().default('America/Sao_Paulo'),
  idioma: z.string().default('pt-BR'),
  moeda: z.string().default('BRL'),
});

export const configuracaoNotificacoesSchema = z.object({
  emailAtivo: z.boolean().default(true),
  pushAtivo: z.boolean().default(true),
  smsAtivo: z.boolean().default(false),
  digestoDiario: z.boolean().default(true),
  alertasUrgentes: z.boolean().default(true),
});

export const configuracaoSchema = z.object({
  empresa: configuracaoEmpresaSchema,
  notificacoes: configuracaoNotificacoesSchema,
});

export type ConfiguracaoData = z.infer<typeof configuracaoSchema>;
