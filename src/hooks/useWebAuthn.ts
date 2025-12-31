/**
 * Hook para gerenciamento de WebAuthn/Passkeys
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { webAuthnService, WebAuthnCredential } from '@/services/WebAuthnService';
import { toast } from 'sonner';

export interface UseWebAuthnReturn {
  // Estado
  isSupported: boolean;
  isPlatformAvailable: boolean;
  isLoading: boolean;
  credentials: WebAuthnCredential[];
  
  // Ações
  registerPasskey: (friendlyName?: string) => Promise<boolean>;
  authenticateWithPasskey: () => Promise<boolean>;
  removeCredential: (credentialId: string) => Promise<boolean>;
  renameCredential: (credentialId: string, newName: string) => Promise<boolean>;
  refreshCredentials: () => Promise<void>;
}

export function useWebAuthn(): UseWebAuthnReturn {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isPlatformAvailable, setIsPlatformAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<WebAuthnCredential[]>([]);

  // Verificar suporte ao WebAuthn
  useEffect(() => {
    const checkSupport = async () => {
      setIsSupported(webAuthnService.isSupported());
      const platformAvailable = await webAuthnService.isPlatformAuthenticatorAvailable();
      setIsPlatformAvailable(platformAvailable);
    };
    checkSupport();
  }, []);

  // Carregar credenciais do usuário
  const refreshCredentials = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const creds = await webAuthnService.listCredentials(user.id);
      setCredentials(creds);
    } catch (error) {
      console.error('Erro ao carregar credenciais:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshCredentials();
  }, [refreshCredentials]);

  // Registrar nova passkey
  const registerPasskey = useCallback(async (friendlyName?: string): Promise<boolean> => {
    if (!user?.id || !user?.email) {
      toast.error('Usuário não autenticado');
      return false;
    }

    if (!isSupported) {
      toast.error('WebAuthn não é suportado neste navegador');
      return false;
    }

    if (!isPlatformAvailable) {
      toast.error('Autenticação biométrica não disponível neste dispositivo');
      return false;
    }

    setIsLoading(true);
    try {
      const result = await webAuthnService.registerCredential(
        user.id,
        user.email,
        friendlyName
      );

      if (result.success) {
        toast.success('Passkey registrada com sucesso!');
        await refreshCredentials();
        return true;
      } else {
        toast.error(result.error || 'Erro ao registrar passkey');
        return false;
      }
    } catch (error) {
      console.error('Erro ao registrar passkey:', error);
      toast.error('Erro ao registrar passkey');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, user?.email, isSupported, isPlatformAvailable, refreshCredentials]);

  // Autenticar com passkey
  const authenticateWithPasskey = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      toast.error('WebAuthn não é suportado neste navegador');
      return false;
    }

    setIsLoading(true);
    try {
      const result = await webAuthnService.authenticate();

      if (result.success) {
        toast.success('Autenticação biométrica bem-sucedida!');
        return true;
      } else {
        toast.error(result.error || 'Erro na autenticação');
        return false;
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      toast.error('Erro na autenticação biométrica');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  // Remover credencial
  const removeCredential = useCallback(async (credentialId: string): Promise<boolean> => {
    if (!user?.id) return false;

    setIsLoading(true);
    try {
      const success = await webAuthnService.removeCredential(credentialId, user.id);
      
      if (success) {
        toast.success('Passkey removida com sucesso');
        await refreshCredentials();
        return true;
      } else {
        toast.error('Erro ao remover passkey');
        return false;
      }
    } catch (error) {
      console.error('Erro ao remover credencial:', error);
      toast.error('Erro ao remover passkey');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, refreshCredentials]);

  // Renomear credencial
  const renameCredential = useCallback(async (credentialId: string, newName: string): Promise<boolean> => {
    if (!user?.id) return false;

    setIsLoading(true);
    try {
      const success = await webAuthnService.renameCredential(credentialId, user.id, newName);
      
      if (success) {
        toast.success('Passkey renomeada com sucesso');
        await refreshCredentials();
        return true;
      } else {
        toast.error('Erro ao renomear passkey');
        return false;
      }
    } catch (error) {
      console.error('Erro ao renomear credencial:', error);
      toast.error('Erro ao renomear passkey');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, refreshCredentials]);

  return {
    isSupported,
    isPlatformAvailable,
    isLoading,
    credentials,
    registerPasskey,
    authenticateWithPasskey,
    removeCredential,
    renameCredential,
    refreshCredentials
  };
}

export default useWebAuthn;
