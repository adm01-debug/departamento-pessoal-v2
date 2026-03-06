import { z } from 'zod';

export const usuarioSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  perfilId: z.string().optional(),
  senha: z.string().min(6, 'Mínimo 6 caracteres').optional(),
  ativo: z.boolean().default(true),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;
