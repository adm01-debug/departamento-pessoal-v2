// V15-282
import { z } from 'zod';
export const empresaSchema = z.object({
  razao_social: z.string().min(3),
  nome_fantasia: z.string().optional(),
  cnpj: z.string().length(14),
  inscricao_estadual: z.string().optional(),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().length(2).optional(),
  regime_tributario: z.enum(['simples_nacional', 'lucro_presumido', 'lucro_real']).optional(),
  status: z.enum(['ativa', 'inativa', 'suspensa']).default('ativa'),
});
export type EmpresaSchema = z.infer<typeof empresaSchema>;
