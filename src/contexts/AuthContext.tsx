import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, AuthError } from '@supabase/supabase-js';
import DOMPurify from 'dompurify';
import { loggerService } from '@/services/loggerService';

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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      loggerService.info('User signed in', { email });
    } catch (e) {
      const err = e as AuthError;
      loggerService.warn('Sign in failed', { email, message: err.message });
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      loggerService.info('User signed out');
    } catch (e) {
      loggerService.error('Sign out error', {}, e as Error);
      throw e;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    try {
      const sanitizedName = DOMPurify.sanitize(name.trim());
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

