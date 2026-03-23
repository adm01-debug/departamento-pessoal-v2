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

async function fetchUserRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase.rpc('get_user_roles', { _user_id: userId });
  if (error || !data) return ['user'];
  return data as AppRole[];
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (newSession?.user) {
        // Set basic user immediately to avoid null flash / redirect race
        setUser(buildUser(newSession.user, ['user']));
        setSession(newSession);
        // Then enrich with real roles asynchronously
        const roles = await fetchUserRoles(newSession.user.id);
        setUser(buildUser(newSession.user, roles));
      } else {
        setUser(null);
        setSession(null);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (initialSession?.user) {
        const roles = await fetchUserRoles(initialSession.user.id);
        setUser(buildUser(initialSession.user, roles));
        setSession(initialSession);
      }
      setLoading(false);
      setIsReady(true);
    });

    return () => subscription.unsubscribe();
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
