// V24: Auth Service - Password recovery
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return { success: true };
  },
  async resetPassword(_token: string, newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return { success: true };
  },
};

export default authService;
