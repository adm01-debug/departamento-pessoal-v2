import { z } from 'zod';
export const empresaSchema = z.object({
  razao_social: z.string().min(3, 'Razão social deve ter no mínimo 3 caracteres'),
  nome_fantasia: z.string().optional(),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  inscricao_estadual: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  cep: z.string().optional(),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().max(2).optional(),
  ativa: z.boolean().default(true),
});
export type EmpresaSchema = z.infer<typeof empresaSchema>;
export type EmpresaSchemaInput = z.input<typeof empresaSchema>;
