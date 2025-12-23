import { z } from 'zod';

export const documentoSchema = z.object({
  colaborador_id: z.string().uuid(),
  tipo: z.enum(['contrato', 'termo', 'atestado', 'declaracao', 'comprovante', 'certidao', 'outro']),
  titulo: z.string().min(3, 'Mínimo 3 caracteres').max(200),
  descricao: z.string().max(500).optional(),
  arquivo_url: z.string().url('URL inválida'),
  arquivo_nome: z.string(),
  arquivo_tipo: z.string(),
  arquivo_tamanho: z.number().min(0),
  data_validade: z.string().optional(),
  visivel_colaborador: z.boolean().default(true),
  requer_assinatura: z.boolean().default(false),
});

export const uploadDocumentoSchema = z.object({
  arquivo: z.any(),
  colaborador_id: z.string().uuid(),
  tipo: z.string(),
  titulo: z.string().min(3),
});

export type DocumentoFormData = z.infer<typeof documentoSchema>;
export type UploadDocumentoData = z.infer<typeof uploadDocumentoSchema>;
