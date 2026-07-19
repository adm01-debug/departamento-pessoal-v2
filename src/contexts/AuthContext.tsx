import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, AuthError } from '@supabase/supabase-js';
import { sanitizePlainText } from '@/utils/sanitizeHtml';
import { loggerService } from '@/services/loggerService';
import { queryClient } from '@/lib/queryClient';
import { validatePasswordFull } from '@/utils/passwordPolicy';

export type AppRole = 'admin' | 'moderator' | 'user';

export interface User {
  id: string;
  email: string;
  name?: string;
  roles: AppRole[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isReady: boolean;
  isAdmin: boolean;
  hasRole: (role: AppRole) => boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_INIT_TIMEOUT_MS = 10000;
const USER_ROLES_TIMEOUT_MS = 5000;

async function fetchUserRoles(userId: string): Promise<AppRole[]> {
  try {
    const { data, error } = await supabase.rpc('get_user_roles', { _user_id: userId });
    if (error) {
      loggerService.error('Error fetching user roles', { userId, error });
      return ['user'];
    }
    return (data as AppRole[]) || ['user'];
  } catch (e) {
    loggerService.error('Exception fetching user roles', { userId }, e as Error);
    return ['user'];
  }
}

function fetchUserRolesWithTimeout(userId: string): Promise<AppRole[]> {
  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(() => {
      loggerService.warn('User roles fetch timed out', { userId });
      resolve(['user']);
    }, USER_ROLES_TIMEOUT_MS);

    fetchUserRoles(userId)
      .then((roles) => {
        window.clearTimeout(timeoutId);
        resolve(roles);
      })
      .catch((error) => {
        window.clearTimeout(timeoutId);
        loggerService.error('Failed to fetch user roles', { userId }, error);
        resolve(['user']);
      });
  });
}

function buildUser(supabaseUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }, roles: AppRole[]): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name as string | undefined,
    roles,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  // Ref espelha `isReady` para leitura no callback do timeout de inicialização
  // sem re-executar o useEffect (que re-subscreveria em onAuthStateChange).
  const isReadyRef = useRef(false);

  const markReady = useCallback(() => {
    setLoading(false);
    setIsReady(true);
    isReadyRef.current = true;
  }, []);


  const enrichUserWithRoles = useCallback(async (supabaseUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) => {
    const roles = await fetchUserRolesWithTimeout(supabaseUser.id);
    setUser(prevUser => prevUser && prevUser.id === supabaseUser.id ? buildUser(supabaseUser, roles) : prevUser);
  }, []);

  const applySession = useCallback((nextSession: Session | null) => {
    if (nextSession?.user) {
      setSession(nextSession);
      setUser(buildUser(nextSession.user, ['user']));
      void enrichUserWithRoles(nextSession.user);
    } else {
      setSession(null);
      setUser(null);
    }
    markReady();
  }, [enrichUserWithRoles, markReady]);

  useEffect(() => {
    let isMounted = true;

    const authInitTimeout = window.setTimeout(() => {
      if (isMounted && !isReadyRef.current) {
        loggerService.warn('Auth initialization timed out');
        markReady();
      }
    }, AUTH_INIT_TIMEOUT_MS);


    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!isMounted) return;
      loggerService.info('Auth state changed', { event, userId: newSession?.user?.id });
      applySession(newSession);
    });

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (isMounted) applySession(initialSession);
      } catch (e) {
        loggerService.error('Auth initialization error', {}, e as Error);
        if (isMounted) {
          applySession(null);
        }
      } finally {
        window.clearTimeout(authInitTimeout);
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
      window.clearTimeout(authInitTimeout);
      subscription.unsubscribe();
    };
  }, [applySession, markReady]);


  const signIn = useCallback(async (email: string, password: string) => {
    try {
      // Check account lockout before attempting authentication
      const { data: lockoutData } = await supabase.rpc('check_account_lockout', { p_email: email });
      if (lockoutData && Array.isArray(lockoutData) && lockoutData[0]?.is_locked) {
        const lockedUntil = lockoutData[0].locked_until;
        const msg = lockedUntil
          ? `Conta temporariamente bloqueada. Tente novamente após ${new Date(lockedUntil).toLocaleTimeString('pt-BR')}.`
          : 'Conta temporariamente bloqueada por excesso de tentativas.';
        loggerService.warn('Login blocked - account locked', { email });
        throw new Error(msg);
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        // Record failed attempt (fire-and-forget)
        supabase.rpc('record_login_attempt', { p_email: email, p_success: false }).catch(() => {});
        throw error;
      }

      // Check if MFA challenge is required (user enrolled TOTP → nextLevel = aal2)
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData?.nextLevel === 'aal2' && aalData.currentLevel !== 'aal2') {
        const { data: factorsData } = await supabase.auth.mfa.listFactors();
        const totpFactor = factorsData?.totp?.[0];
        const mfaErr = new Error('Autenticação de dois fatores necessária.');
        (mfaErr as Error & { code: string; factorId: string }).code = 'mfa_required';
        (mfaErr as Error & { code: string; factorId: string }).factorId = totpFactor?.id || '';
        throw mfaErr;
      }

      // Record successful attempt (fire-and-forget)
      supabase.rpc('record_login_attempt', { p_email: email, p_success: true }).catch(() => {});
      loggerService.info('User signed in', { email });
    } catch (e) {
      const err = e as AuthError | Error;
      loggerService.warn('Sign in failed', { email, message: err.message });
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (e) {
      loggerService.error('Sign out error', {}, e as Error);
    } finally {
      queryClient.clear();
      try { localStorage.clear(); } catch { /* private browsing */ }
      try { sessionStorage.clear(); } catch { /* private browsing */ }
      try { indexedDB.deleteDatabase('ponto-offline-db'); } catch { /* ignore */ }
      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        }
      } catch { /* caches API unavailable */ }
      setUser(null);
      setSession(null);
      loggerService.info('User signed out - all local state cleared');
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const pwCheck = await validatePasswordFull(password);
    if (!pwCheck.valid) {
      throw new Error(`Senha fraca: ${pwCheck.errors.join('; ')}`);
    }
    if (pwCheck.warnings?.length) {
      loggerService.warn('Password breach warning on signup', { email, warnings: pwCheck.warnings });
    }
    try {
      const sanitizedName = sanitizePlainText(name.trim(), 100);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: sanitizedName } }
      });
      if (error) throw error;
      loggerService.info('User signed up', { email });
    } catch (e) {
      loggerService.error('Sign up error', { email }, e as Error);
      throw e;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      loggerService.info('Password reset email sent', { email });
    } catch (e) {
      loggerService.error('Password reset request error', { email }, e as Error);
      throw e;
    }
  }, []);

  const isAdmin = useMemo(() => user?.roles?.includes('admin') ?? false, [user]);
  const hasRole = useCallback((role: AppRole) => user?.roles?.includes(role) ?? false, [user]);

  const value = useMemo(
    () => ({ user, session, loading, isReady, isAdmin, hasRole, signIn, signOut, signUp, resetPassword }),
    [user, session, loading, isReady, isAdmin, hasRole, signIn, signOut, signUp, resetPassword]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

