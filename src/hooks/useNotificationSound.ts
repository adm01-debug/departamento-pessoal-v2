/**
 * @fileoverview Hook para sons de notificação
 * @module hooks/useNotificationSound
 */
import { useCallback, useRef } from 'react';

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback((type: 'success' | 'error' | 'info' = 'info') => {
    // Sons podem ser adicionados como arquivos estáticos
    // Por enquanto, usar Web Audio API para beep simples
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = type === 'success' ? 800 : type === 'error' ? 400 : 600;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio não suportado
    }
  }, []);

  return { play };
}

export default useNotificationSound;
