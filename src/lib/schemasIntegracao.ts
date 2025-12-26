import { z } from 'zod';

export const webhookConfigSchema = z.object({
  url: z.string().url('URL inválida'),
  secret: z.string().optional(),
  eventos: z.array(z.string()).min(1, 'Selecione pelo menos um evento'),
  ativo: z.boolean().default(true),
});

export const integracaoBitrix24Schema = z.object({
  webhookUrl: z.string().url('URL do webhook inválida'),
  ativo: z.boolean().default(true),
  sincronizarColaboradores: z.boolean().default(true),
  sincronizarDepartamentos: z.boolean().default(true),
});

export const integracaoSchema = z.object({
  tipo: z.enum(['bitrix24', 'esocial', 'contabil', 'bancaria', 'ponto', 'beneficios']),
  nome: z.string().min(1, 'Nome obrigatório'),
  configuracao: z.record(z.unknown()),
});

export type IntegracaoData = z.infer<typeof integracaoSchema>;
