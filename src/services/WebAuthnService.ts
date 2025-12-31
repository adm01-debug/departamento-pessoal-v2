/**
 * WebAuthn/Passkeys Service
 * Implementação de autenticação biométrica usando Web Authentication API
 */

import { supabase } from '@/integrations/supabase/client';

// Tipos WebAuthn
export interface PublicKeyCredentialCreationOptionsJSON {
  challenge: string;
  rp: {
    name: string;
    id?: string;
  };
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  pubKeyCredParams: Array<{
    type: 'public-key';
    alg: number;
  }>;
  timeout?: number;
  excludeCredentials?: Array<{
    id: string;
    type: 'public-key';
    transports?: AuthenticatorTransport[];
  }>;
  authenticatorSelection?: {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    requireResidentKey?: boolean;
    residentKey?: 'discouraged' | 'preferred' | 'required';
    userVerification?: 'required' | 'preferred' | 'discouraged';
  };
  attestation?: 'none' | 'indirect' | 'direct' | 'enterprise';
}

export interface PublicKeyCredentialRequestOptionsJSON {
  challenge: string;
  timeout?: number;
  rpId?: string;
  allowCredentials?: Array<{
    id: string;
    type: 'public-key';
    transports?: AuthenticatorTransport[];
  }>;
  userVerification?: 'required' | 'preferred' | 'discouraged';
}

export interface WebAuthnCredential {
  id: string;
  user_id: string;
  credential_id: string;
  public_key: string;
  counter: number;
  device_type: string | null;
  transports: string[] | null;
  created_at: string;
  last_used_at: string | null;
  friendly_name: string | null;
}

// Utilitários de codificação
function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (const byte of bytes) {
    str += String.fromCharCode(byte);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(base64 + padding);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function generateChallenge(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array.buffer);
}

function getDeviceType(): string {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('mac')) return 'macOS';
  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('linux')) return 'Linux';
  return 'Unknown';
}

class WebAuthnService {
  private rpName = 'RH System';
  private rpId: string;

  constructor() {
    // Usar o hostname atual como RP ID
    this.rpId = window.location.hostname;
  }

  /**
   * Verifica se WebAuthn é suportado no navegador
   */
  isSupported(): boolean {
    return !!(
      window.PublicKeyCredential &&
      typeof window.PublicKeyCredential === 'function'
    );
  }

  /**
   * Verifica se o dispositivo suporta autenticação biométrica
   */
  async isPlatformAuthenticatorAvailable(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }

  /**
   * Verifica se Passkeys condicionais são suportados
   */
  async isConditionalMediationAvailable(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      // @ts-ignore - API experimental
      return await PublicKeyCredential.isConditionalMediationAvailable?.() ?? false;
    } catch {
      return false;
    }
  }

  /**
   * Registra uma nova credencial WebAuthn para o usuário
   */
  async registerCredential(userId: string, userEmail: string, friendlyName?: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.isSupported()) {
        return { success: false, error: 'WebAuthn não é suportado neste navegador' };
      }

      // Gerar challenge
      const challenge = generateChallenge();

      // Salvar challenge no banco
      const { error: challengeError } = await supabase
        .from('webauthn_challenges')
        .insert({
          user_id: userId,
          challenge,
          type: 'registration'
        });

      if (challengeError) {
        console.error('Erro ao salvar challenge:', challengeError);
        return { success: false, error: 'Erro ao iniciar registro' };
      }

      // Buscar credenciais existentes para excluir
      const { data: existingCredentials } = await supabase
        .from('webauthn_credentials')
        .select('credential_id, transports')
        .eq('user_id', userId);

      const excludeCredentials = existingCredentials?.map(cred => ({
        id: base64UrlDecode(cred.credential_id),
        type: 'public-key' as const,
        transports: (cred.transports as AuthenticatorTransport[]) || undefined
      })) || [];

      // Opções de criação
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge: base64UrlDecode(challenge),
        rp: {
          name: this.rpName,
          id: this.rpId
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: userEmail,
          displayName: userEmail.split('@')[0]
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },  // ES256
          { type: 'public-key', alg: -257 } // RS256
        ],
        timeout: 60000,
        excludeCredentials,
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          requireResidentKey: true,
          residentKey: 'required',
          userVerification: 'required'
        },
        attestation: 'none'
      };

      // Criar credencial
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential;

      if (!credential) {
        return { success: false, error: 'Falha ao criar credencial' };
      }

      const response = credential.response as AuthenticatorAttestationResponse;
      
      // Extrair dados da credencial
      const credentialId = base64UrlEncode(credential.rawId);
      const publicKey = base64UrlEncode(response.getPublicKey()!);
      const transports = response.getTransports?.() || [];

      // Salvar credencial no banco
      const { error: saveError } = await supabase
        .from('webauthn_credentials')
        .insert({
          user_id: userId,
          credential_id: credentialId,
          public_key: publicKey,
          counter: 0,
          device_type: getDeviceType(),
          transports,
          friendly_name: friendlyName || `${getDeviceType()} Passkey`
        });

      if (saveError) {
        console.error('Erro ao salvar credencial:', saveError);
        return { success: false, error: 'Erro ao salvar credencial' };
      }

      // Limpar challenge usado
      await supabase
        .from('webauthn_challenges')
        .delete()
        .eq('challenge', challenge);

      return { success: true };
    } catch (error) {
      console.error('Erro no registro WebAuthn:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          return { success: false, error: 'Operação cancelada pelo usuário' };
        }
        if (error.name === 'InvalidStateError') {
          return { success: false, error: 'Este dispositivo já está registrado' };
        }
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Erro desconhecido no registro' };
    }
  }

  /**
   * Autentica usando uma credencial WebAuthn existente
   */
  async authenticate(userEmail?: string): Promise<{ success: boolean; userId?: string; error?: string }> {
    try {
      if (!this.isSupported()) {
        return { success: false, error: 'WebAuthn não é suportado neste navegador' };
      }

      // Gerar challenge
      const challenge = generateChallenge();

      // Salvar challenge no banco
      const { error: challengeError } = await supabase
        .from('webauthn_challenges')
        .insert({
          challenge,
          type: 'authentication'
        });

      if (challengeError) {
        console.error('Erro ao salvar challenge:', challengeError);
        return { success: false, error: 'Erro ao iniciar autenticação' };
      }

      // Buscar credenciais permitidas (se email fornecido)
      let allowCredentials: PublicKeyCredentialDescriptor[] | undefined;
      
      if (userEmail) {
        // Buscar user_id pelo email (precisamos de uma função ou lookup)
        // Por enquanto, permitimos qualquer credencial
        allowCredentials = undefined;
      }

      // Opções de autenticação
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: base64UrlDecode(challenge),
        timeout: 60000,
        rpId: this.rpId,
        allowCredentials,
        userVerification: 'required'
      };

      // Autenticar
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      }) as PublicKeyCredential;

      if (!credential) {
        return { success: false, error: 'Falha na autenticação' };
      }

      const response = credential.response as AuthenticatorAssertionResponse;
      const credentialId = base64UrlEncode(credential.rawId);

      // Buscar credencial no banco
      const { data: storedCredential, error: fetchError } = await supabase
        .from('webauthn_credentials')
        .select('*')
        .eq('credential_id', credentialId)
        .single();

      if (fetchError || !storedCredential) {
        return { success: false, error: 'Credencial não encontrada' };
      }

      // Verificar counter (proteção contra replay)
      const authenticatorData = new Uint8Array(response.authenticatorData);
      const dataView = new DataView(authenticatorData.buffer);
      const newCounter = dataView.getUint32(33, false);

      if (newCounter <= storedCredential.counter) {
        return { success: false, error: 'Possível ataque de replay detectado' };
      }

      // Atualizar counter e last_used_at
      await supabase
        .from('webauthn_credentials')
        .update({
          counter: newCounter,
          last_used_at: new Date().toISOString()
        })
        .eq('id', storedCredential.id);

      // Limpar challenge usado
      await supabase
        .from('webauthn_challenges')
        .delete()
        .eq('challenge', challenge);

      return { success: true, userId: storedCredential.user_id };
    } catch (error) {
      console.error('Erro na autenticação WebAuthn:', error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          return { success: false, error: 'Operação cancelada pelo usuário' };
        }
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Erro desconhecido na autenticação' };
    }
  }

  /**
   * Lista credenciais do usuário
   */
  async listCredentials(userId: string): Promise<WebAuthnCredential[]> {
    const { data, error } = await supabase
      .from('webauthn_credentials')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao listar credenciais:', error);
      return [];
    }

    return data as WebAuthnCredential[];
  }

  /**
   * Remove uma credencial
   */
  async removeCredential(credentialId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('webauthn_credentials')
      .delete()
      .eq('id', credentialId)
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao remover credencial:', error);
      return false;
    }

    return true;
  }

  /**
   * Renomeia uma credencial
   */
  async renameCredential(credentialId: string, userId: string, newName: string): Promise<boolean> {
    const { error } = await supabase
      .from('webauthn_credentials')
      .update({ friendly_name: newName })
      .eq('id', credentialId)
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao renomear credencial:', error);
      return false;
    }

    return true;
  }
}

export const webAuthnService = new WebAuthnService();
export default webAuthnService;
