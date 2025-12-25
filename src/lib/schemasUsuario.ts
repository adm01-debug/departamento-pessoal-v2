/**
 * @fileoverview Schema Zod para usuários
 * @module lib/schemasUsuario
 */
import { z } from 'zod';

export const usuarioSchema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres').max(100),
  email: z.string().email('Email inválido'),
  senha: z.string().min(8, 'Mínimo 8 caracteres').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Deve conter maiúscula, minúscula e número').optional(),
  role: z.enum(['admin', 'rh', 'gestor', 'colaborador']),
  ativo: z.boolean().default(true),
  empresa_id: z.string().uuid().optional(),
  departamento_id: z.string().uuid().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha obrigatória'),
});

export const alterarSenhaSchema = z.object({
  senha_atual: z.string().min(1, 'Senha atual obrigatória'),
  nova_senha: z.string().min(8, 'Mínimo 8 caracteres').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Deve conter maiúscula, minúscula e número'),
  confirmar_senha: z.string(),
}).refine(data => data.nova_senha === data.confirmar_senha, {
  message: 'Senhas não conferem',
  path: ['confirmar_senha'],
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type AlterarSenhaData = z.infer<typeof alterarSenhaSchema>;
