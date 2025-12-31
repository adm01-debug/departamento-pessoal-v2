/**
 * TOTP Service - Autenticação de dois fatores
 */

import * as OTPAuth from 'otpauth';
import { supabase } from '@/integrations/supabase/client';

export interface TOTPSetupData {
  secret: string;
  uri: string;
  qrCode: string;
  backupCodes: string[];
}

export interface MFAStatus {
  enabled: boolean;
  verifiedAt: string | null;
  hasBackupCodes: boolean;
}

// Gerar código de backup aleatório
function generateBackupCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Gerar array de códigos de backup
function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    codes.push(generateBackupCode());
  }
  return codes;
}

class TOTPService {
  private issuer = 'RH System';

  /**
   * Gera configuração TOTP para um novo usuário
   */
  async generateSetup(userId: string, userEmail: string): Promise<TOTPSetupData | null> {
    try {
      // Gerar novo secret
      const secret = new OTPAuth.Secret({ size: 20 });

      // Criar TOTP
      const totp = new OTPAuth.TOTP({
        issuer: this.issuer,
        label: userEmail,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret
      });

      // Gerar URI para QR Code
      const uri = totp.toString();

      // Gerar QR Code como data URL
      const QRCode = await import('qrcode');
      const qrCode = await QRCode.toDataURL(uri, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Gerar códigos de backup
      const backupCodes = generateBackupCodes(10);

      // Salvar no banco (ainda não verificado)
      const { error } = await supabase
        .from('user_mfa')
        .upsert({
          user_id: userId,
          totp_secret: secret.base32,
          totp_enabled: false,
          backup_codes: backupCodes,
          verified_at: null
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Erro ao salvar setup TOTP:', error);
        return null;
      }

      return {
        secret: secret.base32,
        uri,
        qrCode,
        backupCodes
      };
    } catch (error) {
      console.error('Erro ao gerar setup TOTP:', error);
      return null;
    }
  }

  /**
   * Verifica código TOTP e ativa MFA
   */
  async verifyAndEnable(userId: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Buscar secret do usuário
      const { data: mfaData, error: fetchError } = await supabase
        .from('user_mfa')
        .select('totp_secret')
        .eq('user_id', userId)
        .single();

      if (fetchError || !mfaData?.totp_secret) {
        return { success: false, error: 'Configuração MFA não encontrada' };
      }

      // Verificar código
      const totp = new OTPAuth.TOTP({
        issuer: this.issuer,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(mfaData.totp_secret)
      });

      const delta = totp.validate({ token: code, window: 1 });

      if (delta === null) {
        return { success: false, error: 'Código inválido' };
      }

      // Ativar MFA
      const { error: updateError } = await supabase
        .from('user_mfa')
        .update({
          totp_enabled: true,
          verified_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        return { success: false, error: 'Erro ao ativar MFA' };
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao verificar TOTP:', error);
      return { success: false, error: 'Erro ao verificar código' };
    }
  }

  /**
   * Verifica código TOTP para login
   */
  async verifyCode(userId: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Buscar secret do usuário
      const { data: mfaData, error: fetchError } = await supabase
        .from('user_mfa')
        .select('totp_secret, totp_enabled, backup_codes')
        .eq('user_id', userId)
        .single();

      if (fetchError || !mfaData) {
        return { success: false, error: 'MFA não configurado' };
      }

      if (!mfaData.totp_enabled) {
        return { success: false, error: 'MFA não está ativado' };
      }

      // Primeiro tentar verificar como código TOTP
      const totp = new OTPAuth.TOTP({
        issuer: this.issuer,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(mfaData.totp_secret)
      });

      const delta = totp.validate({ token: code, window: 1 });

      if (delta !== null) {
        // Log de sucesso
        await this.logVerification(userId, 'totp', true);
        return { success: true };
      }

      // Se não for TOTP, verificar se é código de backup
      const normalizedCode = code.toUpperCase().replace(/\s/g, '');
      const backupCodes = mfaData.backup_codes || [];
      const codeIndex = backupCodes.indexOf(normalizedCode);

      if (codeIndex !== -1) {
        // Remover código usado
        const updatedCodes = backupCodes.filter((_, i) => i !== codeIndex);
        await supabase
          .from('user_mfa')
          .update({ backup_codes: updatedCodes })
          .eq('user_id', userId);

        // Log de sucesso com backup code
        await this.logVerification(userId, 'backup_code', true);
        return { success: true };
      }

      // Log de falha
      await this.logVerification(userId, 'totp', false);
      return { success: false, error: 'Código inválido' };
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      return { success: false, error: 'Erro ao verificar código' };
    }
  }

  /**
   * Desativa MFA
   */
  async disable(userId: string, code: string): Promise<{ success: boolean; error?: string }> {
    // Primeiro verificar o código atual
    const verifyResult = await this.verifyCode(userId, code);
    
    if (!verifyResult.success) {
      return verifyResult;
    }

    // Desativar MFA
    const { error } = await supabase
      .from('user_mfa')
      .update({
        totp_enabled: false,
        totp_secret: null,
        backup_codes: null,
        verified_at: null
      })
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: 'Erro ao desativar MFA' };
    }

    return { success: true };
  }

  /**
   * Obtém status MFA do usuário
   */
  async getStatus(userId: string): Promise<MFAStatus> {
    try {
      const { data, error } = await supabase
        .from('user_mfa')
        .select('totp_enabled, verified_at, backup_codes')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return { enabled: false, verifiedAt: null, hasBackupCodes: false };
      }

      return {
        enabled: data.totp_enabled || false,
        verifiedAt: data.verified_at,
        hasBackupCodes: (data.backup_codes?.length || 0) > 0
      };
    } catch (error) {
      console.error('Erro ao obter status MFA:', error);
      return { enabled: false, verifiedAt: null, hasBackupCodes: false };
    }
  }

  /**
   * Regenera códigos de backup
   */
  async regenerateBackupCodes(userId: string, code: string): Promise<{ success: boolean; codes?: string[]; error?: string }> {
    // Verificar código atual
    const verifyResult = await this.verifyCode(userId, code);
    
    if (!verifyResult.success) {
      return { success: false, error: verifyResult.error };
    }

    // Gerar novos códigos
    const newCodes = generateBackupCodes(10);

    const { error } = await supabase
      .from('user_mfa')
      .update({ backup_codes: newCodes })
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: 'Erro ao gerar novos códigos' };
    }

    return { success: true, codes: newCodes };
  }

  /**
   * Registra tentativa de verificação
   */
  private async logVerification(userId: string, method: 'totp' | 'backup_code' | 'recovery', success: boolean): Promise<void> {
    try {
      await supabase
        .from('mfa_verification_logs')
        .insert({
          user_id: userId,
          method,
          success
        });
    } catch (error) {
      console.error('Erro ao registrar log MFA:', error);
    }
  }
}

export const totpService = new TOTPService();
export default totpService;
