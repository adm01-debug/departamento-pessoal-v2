import { useCallback, useRef } from 'react';
export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const play = useCallback((sound: 'success' | 'error' | 'notification' = 'notification') => { if (!audioRef.current) audioRef.current = new Audio(); audioRef.current.play().catch(() => {}); }, []);
  return { play };
}
