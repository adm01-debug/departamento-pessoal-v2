// V17.2-Z014: Schema de Usuário
import { z } from 'zod';
export const usuarioSchema = z.object({ empresa_id: z.string().uuid(), nome: z.string().min(3), email: z.string().email(), role: z.enum(['admin', 'gestor', 'rh', 'financeiro', 'colaborador', 'contador']) });
export const loginSchema = z.object({ email: z.string().email('Email inválido'), senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres') });
export const alterarSenhaSchema = z.object({ senha_atual: z.string().min(6), nova_senha: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Senha deve conter maiúscula, minúscula e número'), confirmar_senha: z.string() }).refine(data => data.nova_senha === data.confirmar_senha, { message: 'Senhas não conferem', path: ['confirmar_senha'] });
export type UsuarioInput = z.infer<typeof usuarioSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
