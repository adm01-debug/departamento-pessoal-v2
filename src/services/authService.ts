// V25: Auth Service - Result Pattern & Enhanced Security
import { supabase } from '@/integrations/supabase/client';
import { Result, Ok, Err } from '@/types/result';

export const authService = {
  /**
   * Solicita recuperação de senha
   */
  async forgotPassword(email: string): Promise<Result<{ success: boolean }>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      if (error) {
        return Err({
          type: 'AUTH_ERROR',
          severity: 'error',
          message: error.message || 'Falha ao enviar email de recuperação',
          timestamp: new Date(),
        });
      }
      return Ok({ success: true });
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'critical',
        message: e.message || 'Erro inesperado no servidor de autenticação',
        timestamp: new Date(),
      });
    }
  },

  /**
   * Reseta a senha do usuário
   */
  async resetPassword(newPassword: string): Promise<Result<{ success: boolean }>> {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        return Err({
          type: 'AUTH_ERROR',
          severity: 'error',
          message: error.message || 'Falha ao atualizar senha',
          timestamp: new Date(),
        });
      }
      return Ok({ success: true });
    } catch (e: any) {
      return Err({
        type: 'SERVER_ERROR',
        severity: 'critical',
        message: e.message || 'Erro inesperado ao redefinir senha',
        timestamp: new Date(),
      });
    }
  },

  /**
   * Verifica a sessão atual
   */
  async getSession(): Promise<Result<any>> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return Ok(data.session);
    } catch (e: any) {
      return Err({
        type: 'AUTH_ERROR',
        severity: 'info',
        message: 'Sessão inválida ou expirada',
        timestamp: new Date(),
      });
    }
  }
};

export default authService;
