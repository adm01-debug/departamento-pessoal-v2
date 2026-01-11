// V16-027: useAuth Hook - Production Ready
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authServiceReal } from '@/services/authService.real';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const currentSession = await authServiceReal.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = authServiceReal.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const result = await authServiceReal.signIn(email, password);
    setLoading(false);
    if (result.user) {
      navigate('/dashboard');
    }
    return result;
  }, [navigate]);

  const signUp = useCallback(async (email: string, password: string, metadata: any) => {
    setLoading(true);
    const result = await authServiceReal.signUp(email, password, metadata);
    setLoading(false);
    return result;
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    await authServiceReal.signOut();
    setLoading(false);
    navigate('/login');
  }, [navigate]);

  const isAdmin = authServiceReal.isAdmin(user);
  const isRH = authServiceReal.isRH(user);
  const empresaId = user?.user_metadata?.empresa_id;
  const role = user?.user_metadata?.role;

  return {
    user,
    session,
    loading,
    isAuthenticated: !!session,
    isAdmin,
    isRH,
    empresaId,
    role,
    signIn,
    signUp,
    signOut,
  };
}
