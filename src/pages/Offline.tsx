import React from 'react';
import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
export const Offline: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <WifiOff className="h-16 w-16 mx-auto text-muted-foreground" />
      <h1 className="text-2xl font-bold">Você está offline</h1>
      <p className="text-muted-foreground">Verifique sua conexão com a internet</p>
      <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
    </div>
  </div>
);
export default Offline;
