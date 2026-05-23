import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts';

export const metricasSchema = z.object({
  empresaId: z.string().uuid('ID da empresa deve ser um UUID válido').optional(),
});

export const webhookSchema = z.object({
  event: z.string().min(1, 'Evento é obrigatório'),
  data: z.record(z.any()),
  timestamp: z.string().datetime().optional(),
  version: z.string().optional().default('v1'),
});

export const healthcheckSchema = z.object({}).strict();

export const cepSchema = z.object({
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP deve ter 8 dígitos (pode conter hífen)'),
});

export const cnpjSchema = z.object({
  cnpj: z.string().regex(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, 'CNPJ inválido'),
});

export const holeriteSchema = z.object({
  colaboradorId: z.string().uuid('ID do colaborador deve ser um UUID válido'),
  competencia: z.string().regex(/^\d{4}-\d{2}$/, 'Competência deve estar no formato AAAA-MM'),
});

export const calcularFolhaSchema = z.object({
  empresa_id: z.string().uuid('ID da empresa inválido'),
  competencia: z.string().regex(/^\d{4}-\d{2}$/, 'Formato de competência inválido (AAAA-MM)'),
});

export const notificacaoSchema = z.object({
  action: z.enum(['enviar', 'listar']),
  empresaId: z.string().uuid().optional(),
  tipo: z.enum(['info', 'aviso', 'erro', 'sucesso']).optional(),
  destinatarios: z.array(z.object({
    user_id: z.string().uuid(),
  })).optional(),
  assunto: z.string().optional(),
  conteudo: z.string().optional(),
});

export const auditoriaSchema = z.object({
  action: z.enum(['registrar', 'listar', 'resumo']),
  empresaId: z.string().uuid().optional(),
  data: z.object({
    acao: z.string(),
    entidade: z.string(),
    entidade_id: z.string().optional(),
    usuario_id: z.string().optional(),
    usuario_nome: z.string().optional(),
    descricao: z.string().optional(),
    dados_anteriores: z.any().optional(),
    dados_novos: z.any().optional(),
    ip_address: z.string().ip().optional(),
    data_inicio: z.string().datetime().optional(),
    data_fim: z.string().datetime().optional(),
  }).optional(),
});


