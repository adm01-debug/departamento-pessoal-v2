import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';
import DOMPurify from 'dompurify';

type AppRole = 'admin' | 'moderator' | 'user';

interface User {
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

const AUTH_INIT_TIMEOUT_MS = 4000;
const USER_ROLES_TIMEOUT_MS = 2500;

async function fetchUserRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase.rpc('get_user_roles', { _user_id: userId });
  if (error || !data) return ['user'];
  return data as AppRole[];
}

function fetchUserRolesWithTimeout(userId: string): Promise<AppRole[]> {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      console.warn('User roles fetch timed out, using default role.');
      resolve(['user']);
    }, USER_ROLES_TIMEOUT_MS);

    fetchUserRoles(userId)
      .then((roles) => {
        window.clearTimeout(timeoutId);
        resolve(roles);
      })
      .catch((error) => {
        window.clearTimeout(timeoutId);
        reject(error);
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

  useEffect(() => {
    let isMounted = true;

    const markReady = () => {
      if (!isMounted) return;
      setLoading(false);
      setIsReady(true);
    };

    const applySession = (nextSession: Session | null) => {
      if (!isMounted) return;

      if (nextSession?.user) {
        setUser(buildUser(nextSession.user, ['user']));
        setSession(nextSession);
      } else {
        setUser(null);
        setSession(null);
      }

      markReady();
    };

    const enrichUserWithRoles = async (supabaseUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }) => {
      try {
        const roles = await fetchUserRolesWithTimeout(supabaseUser.id);
        if (!isMounted) return;
        setUser(buildUser(supabaseUser, roles));
      } catch (e) {
        console.warn('Failed to fetch user roles, using default:', e);
      }
    };

    const authInitTimeout = window.setTimeout(() => {
      console.warn('Auth initialization timed out, continuing without blocking the UI.');
      markReady();
    }, AUTH_INIT_TIMEOUT_MS);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      applySession(newSession);

      if (newSession?.user) {
        void enrichUserWithRoles(newSession.user);
      }
    });

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        applySession(initialSession);

        if (initialSession?.user) {
          await enrichUserWithRoles(initialSession.user);
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
        if (!isMounted) return;
        setUser(null);
        setSession(null);
        markReady();
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
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const sanitizedName = DOMPurify.sanitize(name.trim());
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { name: sanitizedName } } });
    if (error) throw error;
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
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
