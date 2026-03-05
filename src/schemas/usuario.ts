import { z } from 'zod';

export const usuarioSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres').optional(),
  confirmarSenha: z.string().optional(),
  perfil: z.enum(['admin', 'gestor', 'operador', 'visualizador']),
  perfilId: z.string().optional(),
  permissoes: z.array(z.string()).optional(),
  ativo: z.boolean(),
}).refine(data => {
  if (data.senha && data.confirmarSenha) return data.senha === data.confirmarSenha;
  return true;
}, { message: 'Senhas não conferem', path: ['confirmarSenha'] });

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(1, 'Senha obrigatória'),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
