/**
 * @fileoverview Hook para gerenciamento de MFA
 * @module hooks/useMFA
 */
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface MFAStatus {
  enabled: boolean;
  type: 'totp' | 'sms' | 'both' | null;
  verifiedAt: string | null;
  hasBackupCodes: boolean;
}

export interface MFAEnrollResult {
  factorId: string;
  qrCode: string;
  secret: string;
}

export function useMFA() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [mfaStatus, setMfaStatus] = useState<MFAStatus | null>(null);

  // Buscar status do MFA
  const fetchMFAStatus = useCallback(async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('user_mfa')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar status MFA:', error);
        return null;
      }

      const status: MFAStatus = {
        enabled: data?.mfa_enabled ?? false,
        type: data?.mfa_type as MFAStatus['type'] ?? null,
        verifiedAt: data?.verified_at ?? null,
        hasBackupCodes: (data?.backup_codes?.length ?? 0) > 0,
      };

      setMfaStatus(status);
      return status;
    } catch (err) {
      console.error('Erro ao buscar MFA:', err);
      return null;
    }
  }, [user?.id]);

  // Iniciar enrollment TOTP
  const enrollTOTP = useCallback(async (friendlyName?: string): Promise<MFAEnrollResult | null> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: friendlyName || 'Authenticator App',
      });

      if (error) {
        toast.error('Erro ao iniciar configuração MFA');
        return null;
      }

      return {
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      };
    } catch (err) {
      toast.error('Erro inesperado');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verificar código TOTP
  const verifyTOTP = useCallback(async (factorId: string, code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code,
      });

      if (error) {
        toast.error('Código inválido');
        return false;
      }

      // Salvar no banco
      await supabase.from('user_mfa').upsert({
        user_id: user?.id,
        mfa_enabled: true,
        mfa_type: 'totp',
        verified_at: new Date().toISOString(),
      });

      toast.success('MFA ativado com sucesso!');
      await fetchMFAStatus();
      return true;
    } catch (err) {
      toast.error('Erro ao verificar código');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, fetchMFAStatus]);

  // Desativar MFA
  const disableMFA = useCallback(async (factorId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });

      if (error) {
        toast.error('Erro ao desativar MFA');
        return false;
      }

      await supabase
        .from('user_mfa')
        .update({ mfa_enabled: false })
        .eq('user_id', user?.id);

      toast.success('MFA desativado');
      await fetchMFAStatus();
      return true;
    } catch (err) {
      toast.error('Erro ao desativar MFA');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, fetchMFAStatus]);

  // Gerar códigos de backup
  const generateBackupCodes = useCallback(async (): Promise<string[]> => {
    const codes = Array.from({ length: 10 }, () =>
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );

    try {
      await supabase
        .from('user_mfa')
        .update({ backup_codes: codes })
        .eq('user_id', user?.id);

      return codes;
    } catch (err) {
      toast.error('Erro ao gerar códigos de backup');
      return [];
    }
  }, [user?.id]);

  // Verificar código de backup
  const verifyBackupCode = useCallback(async (code: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('user_mfa')
        .select('backup_codes')
        .eq('user_id', user?.id)
        .single();

      if (error || !data?.backup_codes) {
        return false;
      }

      const codes = data.backup_codes as string[];
      const index = codes.indexOf(code.toUpperCase());

      if (index === -1) {
        toast.error('Código de backup inválido');
        return false;
      }

      // Remover código usado
      const newCodes = codes.filter((_, i) => i !== index);
      await supabase
        .from('user_mfa')
        .update({ backup_codes: newCodes })
        .eq('user_id', user?.id);

      return true;
    } catch (err) {
      return false;
    }
  }, [user?.id]);

  // Listar fatores ativos
  const listFactors = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) return { totp: [], phone: [] };
      return data;
    } catch {
      return { totp: [], phone: [] };
    }
  }, []);

  return {
    mfaStatus,
    isLoading,
    fetchMFAStatus,
    enrollTOTP,
    verifyTOTP,
    disableMFA,
    generateBackupCodes,
    verifyBackupCode,
    listFactors,
  };
}
