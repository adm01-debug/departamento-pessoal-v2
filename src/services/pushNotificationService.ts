import { supabase } from '@/integrations/supabase/client';

export const pushNotificationService = {
  async isSupported(): Promise<boolean> {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  },

  async getSubscription(): Promise<PushSubscription | null> {
    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  },

  async subscribeUser(userId: string): Promise<boolean> {
    try {
      if (!(await this.isSupported())) {
        throw new Error('Notificações Push não são suportadas neste navegador.');
      }

      const registration = await navigator.serviceWorker.ready;
      
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permissão para notificações negada.');
      }

      // Em um cenário real, usaríamos uma VAPID KEY real do env
      // const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      const subscribeOptions = {
        userVisibleOnly: true,
        // applicationServerKey: vapidKey
      };

      const subscription = await registration.pushManager.subscribe(subscribeOptions);
      
      // Save to Supabase
      const { endpoint, keys } = subscription.toJSON();
      if (!endpoint) throw new Error('Endpoint de push inválido');

      const { error } = await supabase.from('push_subscriptions' as any).upsert({
        user_id: userId,
        endpoint,
        p256dh: (keys as any).p256dh,
        auth_key: (keys as any).auth,
        ativo: true,
        device_info: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: (navigator as any).platform
        }
      }, { onConflict: 'endpoint' });

      if (error) throw error;
      return true;
    } catch (e: any) {
      console.error('Erro ao subscrever para Push:', e);
      throw e;
    }
  },

  async unsubscribeUser(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        const { endpoint } = subscription.toJSON();
        
        await supabase.from('push_subscriptions' as any)
          .update({ ativo: false })
          .eq('endpoint', endpoint)
          .eq('user_id', userId);
      }
      return true;
    } catch (e) {
      console.error('Erro ao cancelar subscrição Push:', e);
      return false;
    }
  }
};
