import { useNavigator } from '@/hooks/useNavigator';
import { Wifi, WifiOff } from 'lucide-react';

function useIsOffline() {
  if (typeof navigator !== 'undefined') {
    return !navigator.onLine;
  }
  return false;
}

export function ConnectionStatus() {
  const isOffline = useIsOffline();
  if (!isOffline) return null;
  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-full shadow-lg z-50">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">Sem conexão</span>
    </div>
  );
}
