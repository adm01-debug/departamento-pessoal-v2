import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSecurityMonitor() {
  const lastUserId = useRef<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = (supabase as any).auth.onAuthStateChange(
      (_event: string, session: any) => {
        if (!session?.user?.id) {
          lastUserId.current = null;
          return;
        }

        const currentId = session.user.id;

        // Detect unexpected user change mid-session (potential session fixation)
        if (lastUserId.current && lastUserId.current !== currentId) {
          (supabase as any).auth.signOut();
          window.location.href = '/login?reason=session_anomaly';
          return;
        }

        lastUserId.current = currentId;
      }
    );

    return () => subscription?.unsubscribe();
  }, []);
}
