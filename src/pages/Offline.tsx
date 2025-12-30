/**
 * @fileoverview Página Offline
 */
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw } from 'lucide-react';

const OfflinePage = memo(function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="p-6 bg-muted rounded-full inline-block">
          <WifiOff className="h-16 w-16 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold">Você está offline</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Verifique sua conexão com a internet e tente novamente.
        </p>
        <Button onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    </div>
  );
});

export default OfflinePage;
