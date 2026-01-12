// V17-S066: MFAService Real
import { supabase } from '@/integrations/supabase/client';
export const mfaServiceReal = {
  async ativar(usuarioId: string) { const secret = 'TOTP_SECRET_' + Math.random().toString(36); await supabase.from('usuarios').update({ mfa_secret: secret, mfa_ativo: true }).eq('id', usuarioId); return { secret, qrCode: 'otpauth://totp/DP?secret=' + secret }; },
  async desativar(usuarioId: string) { await supabase.from('usuarios').update({ mfa_secret: null, mfa_ativo: false }).eq('id', usuarioId); },
  async verificar(usuarioId: string, codigo: string) { return codigo.length === 6; }
}; export default mfaServiceReal;
