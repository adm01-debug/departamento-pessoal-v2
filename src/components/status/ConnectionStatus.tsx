import { useOffline } from '@/hooks/useOffline';
import { Wifi, WifiOff } from 'lucide-react';
export function ConnectionStatus() {
  const { isOffline } = useOffline();
  if (!isOffline) return null;
  return (<div className="fixed bottom-4 left-4 flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-full shadow-lg z-50"><WifiOff className="h-4 w-4" /><span className="text-sm font-medium">Sem conexão</span></div>);
}
