import { supabase } from '@/integrations/supabase/client';

export const pushNotificationService = {
  /**
   * Solicita permissão para notificações e registra a inscrição no banco
   */
  async requestPermissionAndRegister(userId: string) {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('Este navegador não suporta notificações push.');
      return false;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;

    const registration = await navigator.serviceWorker.ready;
    
    try {
      // Obter chave pública VAPID do servidor
      const { data: config } = await supabase
        .from('configuracoes_sistema' as any)
        .select('vapid_public_key')
        .maybeSingle();

      const publicVapidKey = config?.vapid_public_key || 'BDM...[Default Key]...';

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(publicVapidKey)
      });

      // Salvar inscrição no banco vinculada ao usuário
      await (supabase as any).from('push_subscriptions').upsert({
        user_id: userId,
        subscription: JSON.stringify(subscription),
        device_info: navigator.userAgent,
        active: true,
        updated_at: new Date().toISOString()
      });

      return true;
    } catch (err) {
      console.error('Falha ao registrar push subscription:', err);
      return false;
    }
  },

  /**
   * Utilitário para converter chave VAPID
   */
  urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
};
