// V16-014: AuthService - Production Ready with Supabase Auth
import { supabase } from '@/integrations/supabase/client';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface UserMetadata {
  nome: string;
  empresa_id?: string;
  role?: 'admin' | 'rh' | 'financeiro' | 'gestor' | 'colaborador';
  avatar_url?: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error?: string;
}

export const authServiceReal = {
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, session: null, error: this.getErrorMessage(error) };
    }

    // Log audit
    if (data.user) {
      await supabase.from('auditoria').insert({
        usuario_id: data.user.id,
        usuario_nome: data.user.email,
        acao: 'login',
        empresa_id: data.user.user_metadata?.empresa_id,
      });
    }

    return { user: data.user, session: data.session };
  },

  async signUp(email: string, password: string, metadata: UserMetadata): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin + '/confirmar-email',
      },
    });

    if (error) {
      return { user: null, session: null, error: this.getErrorMessage(error) };
    }

    return { user: data.user, session: data.session };
  },

  async signOut(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await supabase.from('auditoria').insert({
        usuario_id: user.id,
        usuario_nome: user.email,
        acao: 'logout',
        empresa_id: user.user_metadata?.empresa_id,
      });
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-senha',
    });

    if (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }

    return { success: true };
  },

  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }

    return { success: true };
  },

  async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async getUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async updateUserMetadata(metadata: Partial<UserMetadata>): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.updateUser({
      data: metadata,
    });

    if (error) throw error;
    return user;
  },

  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },

  getErrorMessage(error: AuthError): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Email ou senha incorretos';
      case 'Email not confirmed':
        return 'Email não confirmado. Verifique sua caixa de entrada.';
      case 'User already registered':
        return 'Este email já está cadastrado';
      case 'Password should be at least 6 characters':
        return 'A senha deve ter pelo menos 6 caracteres';
      case 'Rate limit exceeded':
        return 'Muitas tentativas. Aguarde um momento.';
      default:
        return error.message || 'Erro desconhecido';
    }
  },

  hasRole(user: User | null, roles: string[]): boolean {
    if (!user) return false;
    const userRole = user.user_metadata?.role;
    return roles.includes(userRole);
  },

  isAdmin(user: User | null): boolean {
    return this.hasRole(user, ['admin', 'super_admin']);
  },

  isRH(user: User | null): boolean {
    return this.hasRole(user, ['admin', 'rh', 'super_admin']);
  },
};

// Named export for compatibility
export const authService = authServiceReal;
export default authServiceReal;
